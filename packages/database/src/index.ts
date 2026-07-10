import { createClient } from '@supabase/supabase-js';
import type { Database } from './types.js';

export * from './types.js';

export const createCopperClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
