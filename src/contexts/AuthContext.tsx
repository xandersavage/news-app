"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: AuthError | null | { message: string; status?: number };
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Convert Supabase error codes to user-friendly messages
        let message = error.message;
        switch (error.message) {
          case "Invalid login credentials":
            message = "Invalid email or password. Please try again.";
            break;
          case "Email not confirmed":
            message = "Please verify your email address before logging in.";
            break;
          case "Invalid email":
            message = "Please enter a valid email address.";
            break;
          // Add more error cases as needed
        }
        return { error: { ...error, message } };
      }

      return { error: null };
    } catch (err) {
      console.error("Login error:", err);
      return {
        error: {
          message: "An unexpected error occurred. Please try again later.",
          status: 500,
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear local state
      setUser(null);
      setSession(null);

      // Force a hard navigation to home page to bypass middleware
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Still redirect to home even if there's an error
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
