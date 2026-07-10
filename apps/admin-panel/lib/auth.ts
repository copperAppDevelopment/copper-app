import { createClient } from '@supabase/supabase-js';
import type { Database } from '@copper/database';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdnNkZHFpdXp6aWdiaHlncnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzQxMTMsImV4cCI6MjA2MTcxMDExM30.kl-hclDOiZ38-DANZDcgXc9LXvaAl8vEmIg0AqQmFJc';

/**
 * Valida de forma segura el token JWT de Supabase del usuario autenticado.
 * Retorna el usuario de Supabase Auth si es válido, de lo contrario retorna null.
 */
export async function getAuthUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    // Creamos un cliente temporal sin persistencia para validar el token
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error al validar token de Supabase Auth:', err);
    return null;
  }
}
