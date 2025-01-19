import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqxkjgslyyvlooindhxw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeGtqZ3NseXl2bG9vaW5kaHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4MjI0MTcsImV4cCI6MjAyMzM5ODQxN30.vOLWk_6BFKM6iLqnrHLqxDyXEuQbGBNhyuQZGYrv0Oc';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);