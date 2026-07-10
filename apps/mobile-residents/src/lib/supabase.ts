import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '@copper/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdnNkZHFpdXp6aWdiaHlncnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzQxMTMsImV4cCI6MjA2MTcxMDExM30.kl-hclDOiZ38-DANZDcgXc9LXvaAl8vEmIg0AqQmFJc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
