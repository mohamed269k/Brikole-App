import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Memoized instance to avoid re-calculating on every call.
let supabaseInstance: { client: SupabaseClient | null; isConfigured: boolean; } | null = null;

export const getSupabase = (): { client: SupabaseClient | null; isConfigured: boolean } => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Hardcoded Supabase credentials
  const supabaseUrl = "https://ybemgdvacgnzaqeihldk.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZW1nZHZhY2duemFxZWlobGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODU2NjgsImV4cCI6MjA3NzA2MTY2OH0.yuLL5APU71xYGfr42PEheKKKeyT5n5n5WIFywXkwAho";

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      supabaseInstance = { client, isConfigured: true };
    } catch (error) {
      console.error("Error initializing Supabase client:", error);
      supabaseInstance = { client: null, isConfigured: false };
    }
  } else {
    // This warning helps in debugging but won't be visible to end-users.
    console.warn("Supabase credentials not found. Authentication features will be disabled.");
    supabaseInstance = { client: null, isConfigured: false };
  }

  return supabaseInstance;
};