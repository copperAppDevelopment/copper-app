import { NextResponse } from 'next/server';

// Estructura en memoria para almacenar marcas de tiempo de las peticiones por IP
const rateLimitMap = new Map<string, number[]>();

// Configuración del Rate Limit: Máximo 3 peticiones por 5 minutos
const MAX_REQUESTS = 3;
const TIME_WINDOW_MS = 5 * 60 * 1000; // 5 minutos

// Cabeceras CORS comunes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // En producción se puede restringir al dominio de la landing
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Manejo del preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { nombre, apellido, email, telefono, conjunto, ayudaOp, detalles, website } = await request.json();

    // 1️⃣ Honeypot Check (Anti-Bot)
    if (website) {
      console.warn("Honeypot activado en Next.js API. Rechazando bot.");
      return NextResponse.json({ message: "Solicitud recibida" }, { status: 200, headers: corsHeaders });
    }

    // 2️⃣ Rate Limiting por IP en Next.js
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0]?.trim() : 'unknown') || 'unknown';
    const now = Date.now();

    if (!rateLimitMap.has(clientIp)) {
      rateLimitMap.set(clientIp, []);
    }

    const requestTimestamps = rateLimitMap.get(clientIp)!;
    const activeTimestamps = requestTimestamps.filter((time) => now - time < TIME_WINDOW_MS);

    if (activeTimestamps.length >= MAX_REQUESTS) {
      console.warn(`Rate limit excedido en Next.js para la IP: ${clientIp}`);
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor, intenta de nuevo más tarde." },
        { status: 429, headers: corsHeaders }
      );
    }

    activeTimestamps.push(now);
    rateLimitMap.set(clientIp, activeTimestamps);

    // 3️⃣ Validación de campos
    if (!nombre || !apellido || !email || !telefono || !conjunto || !ayudaOp || !detalles) {
      return NextResponse.json(
        { error: "Por favor, completa todos los campos obligatorios." },
        { status: 400, headers: corsHeaders }
      );
    }

    // 4️⃣ Delegación a Supabase Edge Function
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      throw new Error("SUPABASE_ANON_KEY no configurada en el panel administrativo.");
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/send-contact-email`;

    const edgeFunctionResponse = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        nombre,
        apellido,
        email,
        telefono,
        nombre_conjunto: conjunto,
        tipo_solicitud: ayudaOp,
        descripcion: detalles,
      }),
    });

    if (!edgeFunctionResponse.ok) {
      const errorText = await edgeFunctionResponse.text();
      console.error("Error de Supabase Edge Function desde Next.js:", errorText);
      return NextResponse.json(
        { error: "Error interno al enviar la solicitud de contacto." },
        { status: 500, headers: corsHeaders }
      );
    }

    const responseData = await edgeFunctionResponse.json();

    return NextResponse.json(responseData, { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error("Error en API Next.js Contact:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}
