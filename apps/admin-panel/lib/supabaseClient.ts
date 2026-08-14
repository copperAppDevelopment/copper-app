import { createCopperClient } from '@copper/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.warn("PUBLIC_SUPABASE_ANON_KEY no está configurada en Next.js. El cliente de autenticación fallará.");
}

export const supabase = createCopperClient(supabaseUrl, supabaseAnonKey);
