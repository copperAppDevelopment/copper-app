import { createClient } from '@supabase/supabase-js';
import type { Database } from '@copper/database';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY no está configurada en Next.js. El registro administrativo fallará.");
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
