import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;
let isConfiguredFlag = false; // Initially not configured

const initializeSupabase = () => {
  // Only attempt to initialize if not already configured
  if (isConfiguredFlag) {
    return;
  }

  const supabaseUrl = process.env.SECRET_1;
  const supabaseAnonKey = process.env.SECRET_2;
  
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    isConfiguredFlag = true;
  }
};

export const getSupabase = () => {
  initializeSupabase(); // Attempt initialization
  
  if (isConfiguredFlag) {
    return supabaseInstance;
  }
  
  // If still not configured, return a mock client to prevent crashes
  console.warn(
    'Supabase URL or Anon Key is missing. ' +
    'Please add your Supabase project URL and anon key to secrets.json for authentication to work.'
  );
  return {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase credentials are not configured.' } }),
      signUp: () => Promise.resolve({ error: { message: 'Supabase credentials are not configured.' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
};

export const isSupabaseConfigured = () => {
  initializeSupabase(); // Attempt initialization
  return isConfiguredFlag;
};