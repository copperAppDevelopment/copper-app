import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ================== SUPABASE CLIENT ==================
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Cliente aparte, sin service role, solo para validar el JWT del llamante.
const supabaseAuth = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// ================== CORS ==================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// ================== CSV PARSER (respeta comillas) ==================
// Necesario para CSVs en inglés donde los valores monetarios como
// "$1,145,200.00" van entre comillas y contienen comas internas.
function parseCSVRow(row: string, delimiter: string): string[] {
  const cols: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      cols.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cols.push(current.trim());
  return cols;
}

// ================== MONEY PARSER ==================
// Soporta ambos formatos:
//   Colombiano: $1.145.200,00  (punto = miles, coma = decimal)
//   Americano:  $1,145,200.00  (coma = miles, punto = decimal)
function parseMoney(value: string | null): number | null {
  if (!value) return null;

  // Quitar símbolo de moneda, espacios y otros caracteres no numéricos
  const clean = value.replace(/[^\d.,-]/g, "").trim();

  if (!clean) return null;

  // Formato americano: 1,145,200.00 — comas cada 3 dígitos, punto decimal
  if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(clean)) {
    return Number(clean.replace(/,/g, ""));
  }

  // Formato colombiano: 1.145.200,00 — puntos cada 3 dígitos, coma decimal
  if (/^\d{1,3}(\.\d{3})*(,\d+)?$/.test(clean)) {
    return Number(clean.replace(/\./g, "").replace(",", "."));
  }

  // Fallback: número simple sin separador de miles
  const fallback = clean.replace(",", ".");
  const num = Number(fallback);
  return isNaN(num) ? null : num;
}

// =====================================================
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  try {
    const { file_url, conjunto_id, mes } = await req.json();

    if (!file_url || !conjunto_id || !mes) {
      return new Response(
        JSON.stringify({
          error: "file_url, conjunto_id y mes son obligatorios",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ================== AUTORIZACIÓN ==================
    // `verify_jwt` solo garantiza que el token es válido, y la anon key lo es: sin esta
    // comprobación cualquiera podía inyectar recaudos en cualquier conjunto, porque abajo
    // se usa el service role.
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ status: "error", message: "No autorizado" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: adminConjunto } = await supabase
      .from("admins_conjuntos")
      .select("id")
      .eq("user_id", user.id)
      .eq("conjunto_id", conjunto_id)
      .eq("activo", true)
      .maybeSingle();

    if (!adminConjunto) {
      return new Response(
        JSON.stringify({ status: "error", message: "No administras este conjunto" }),
        { status: 403, headers: corsHeaders }
      );
    }

    // ================== DESCARGAR CSV ==================
    const response = await fetch(file_url);

    // Sin esta comprobación, un 404 devolvía {status:"ok", procesadas:0}: la carga parecía
    // correcta y no se insertaba nada.
    if (!response.ok) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: `No se pudo leer el archivo (HTTP ${response.status})`,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const csvText = await response.text();

    // ================== DETECTAR DELIMITADOR ==================
    // Se analiza la primera línea con fecha para determinar el delimitador real
    const sampleLine = csvText
      .split("\n")
      .find((r) => r.match(/\d{4}\/\d{2}\/\d{2}/)) ?? "";

    const semicolonCount = (sampleLine.match(/;/g) ?? []).length;
    const commaCount = (sampleLine.match(/,/g) ?? []).length;
    const delimiter = semicolonCount >= commaCount ? ";" : ",";

    // ================== FILTRAR FILAS DE DATOS ==================
    const rows = csvText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .filter((r) => r.match(/\d{4}\/\d{2}\/\d{2}/));

    let insertados = 0;
    let errores = 0;
    let duplicados = 0;
    const detalles: any[] = [];

    // ==================================================
    for (const row of rows) {
      // Usar el parser que respeta campos entre comillas
      const cols = parseCSVRow(row, delimiter);

      const fecha               = cols[1];
      const fecha_aplicacion    = cols[2];
      const tipo_recaudo_origen = cols[3];
      const origen              = cols[4];
      const referencia_1        = cols[5]; // número de apartamento
      const referencia_2        = cols[6];
      const referencia_3        = cols[7];
      const referencia_4        = cols[8];
      const referencia_5        = cols[9];
      const valor_efectivo      = parseMoney(cols[10]);
      const valor_total         = parseMoney(cols[11]);
      const valor_cheque        = parseMoney(cols[12]);

      // Validación básica antes de consultar la BD
      if (!fecha || !referencia_1) {
        errores++;
        detalles.push({ tipo: "validacion", linea: row, error: "Fecha o referencia_1 vacíos" });
        continue;
      }

      // ================== BUSCAR APARTAMENTO ==================
      const { data: apto, error: aptoError } = await supabase
        .from("apartamentos")
        .select("id")
        .eq("conjunto_id", conjunto_id)
        .eq("numero_apartamento", referencia_1)
        .maybeSingle();

      if (!apto || aptoError) {
        errores++;
        detalles.push({
          tipo: "apartamento",
          linea: row,
          referencia_1,
          error: `Apartamento ${referencia_1} no encontrado`,
        });
        continue;
      }

      // ================== INSERTAR RECAUDO ==================
      const { data: recaudo, error: insertError } = await supabase
        .from("recaudos")
        .insert({
          conjunto_id,
          apartamento_id:     apto.id,
          fecha,
          fecha_aplicacion,
          tipo_recaudo_origen,
          origen,
          referencia_1,
          referencia_2,
          referencia_3,
          referencia_4,
          referencia_5,
          valor_efectivo,
          valor_total,
          valor_cheque,
          archivo_url: file_url,
          periodo:     mes,
        })
        .select("id")
        .single();

      if (insertError) {
        // 23505 = choque contra `unique_recaudo_por_apto`: la fila ya existía. No es un
        // fallo, es lo que hace seguro reintentar sobre el mismo archivo.
        const esDuplicado = insertError.code === "23505";
        if (esDuplicado) duplicados++; else errores++;

        detalles.push({
          tipo: esDuplicado ? "duplicado" : "insercion",
          linea: row,
          referencia_1,
          error: esDuplicado
            ? `Recaudo duplicado para apartamento ${referencia_1}`
            : insertError.message,
        });
        continue;
      }

      // ================== APLICAR RECAUDO ==================
      const { error: aplicarError } = await supabase.rpc("aplicar_recaudo", {
        p_recaudo_id: recaudo.id,
      });

      if (aplicarError) {
        // El recaudo quedó insertado: reintentar el archivo chocará con el índice único y
        // no volverá a intentar la aplicación. Se devuelve el `recaudo_id` para que el
        // panel pueda reintentar solo esta parte.
        errores++;
        detalles.push({
          tipo: "aplicacion",
          linea: row,
          referencia_1,
          recaudo_id: recaudo.id,
          error: `Insertado pero no aplicado: ${aplicarError.message}`,
        });
        continue;
      }

      insertados++;
    }

    // ================== RESPUESTA ==================
    return new Response(
      JSON.stringify({
        status:    "ok",
        procesadas: rows.length,
        insertados,
        duplicados,
        errores,
        detalles,
      }),
      { headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ status: "error", message: e.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
