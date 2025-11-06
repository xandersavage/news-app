"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default function AdminCreatePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </ThemeProvider>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <ThemeProvider>
      <AdminLayout
        currentView="create"
        onViewChange={(view) => {
          if (view === "dashboard") {
            router.push("/admin/dashboard");
          } else if (view === "articles") {
            router.push("/admin/dashboard/articles");
          }
        }}
        onLogout={handleLogout}
      >
        <ArticleForm />
      </AdminLayout>
    </ThemeProvider>
  );
}
