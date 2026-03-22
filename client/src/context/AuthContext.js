import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email Register
  async function register(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        }
      }
    });
    
    if (error) throw error;
    
    // Create profile in portfolios table if it doesn't exist
    // Note: This usually happens via a Supabase Trigger, but we can do it here too
    if (data.user) {
      await supabase.from('portfolios').upsert({
         id: data.user.id,
         name: displayName || data.user.email.split('@')[0],
      });
    }

    return data.user;
  }

  // Email Login
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  // Google Login
  async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
    return data;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          ...session.user,
          displayName: session.user.user_metadata?.display_name || session.user.email.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          ...session.user,
          displayName: session.user.user_metadata?.display_name || session.user.email.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
