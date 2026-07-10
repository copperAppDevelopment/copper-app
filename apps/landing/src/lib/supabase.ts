import { createCopperClient } from '@copper/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createCopperClient(supabaseUrl, supabaseAnonKey);
