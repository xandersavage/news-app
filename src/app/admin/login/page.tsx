"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoginPage as LoginPageComponent } from "@/components/admin/LoginPage";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      const redirect = async () => {
        try {
          await router.push("/admin/dashboard");
        } finally {
          setIsRedirecting(false);
        }
      };
      redirect();
    }
  }, [user, router]);

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      // Successful login - AuthContext will trigger the useEffect above
      return { error: null };
    }
    return result;
  };

  return (
    <ThemeProvider>
      <LoginPageComponent
        onLogin={handleLogin}
        loading={authLoading || isRedirecting}
      />
    </ThemeProvider>
  );
}
