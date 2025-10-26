import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured as checkSupabaseConfig } from '../lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isConfigured, setIsConfigured] = useState(checkSupabaseConfig()); // Check initial state

  useEffect(() => {
    // This effect runs once to set up polling if config is not ready.
    if (isConfigured) return;

    const intervalId = setInterval(() => {
      if (checkSupabaseConfig()) {
        setIsConfigured(true);
        clearInterval(intervalId);
      }
    }, 300); // Poll every 300ms

    // Stop polling after 5 seconds to avoid infinite loops
    const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
    }, 5000);

    return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
  }, [isConfigured]); // Depend on isConfigured to stop polling once it's true.

  useEffect(() => {
    // This effect sets up auth listeners once the config is ready.
    if (!isConfigured) return;

    const supabase = getSupabase();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isConfigured]); // This now depends on isConfigured

  const signOut = async () => {
    if (!isConfigured) return;
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  const value = {
    session,
    user,
    signOut,
    isConfigured, // The stateful, reactive value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};