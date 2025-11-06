import React, { useState } from "react";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LoginPageProps {
  onLogin: (
    email: string,
    password: string
  ) => Promise<{ error: { message?: string } | null }>;
  loading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  loading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await onLogin(email, password);
      if (error) {
        setError(error.message || "Invalid email or password");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1
              className="text-gray-900 dark:text-white font-serif mb-2"
              style={{ fontSize: "2rem" }}
            >
              The Chronicle
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Admin Dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="admin@chronicle.com"
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  required
                  disabled={isLoading || loading}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  required
                  disabled={isLoading || loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-[#007BFF] focus:ring-[#007BFF]"
                  disabled={isLoading || loading}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-[#007BFF] hover:underline text-sm">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white disabled:opacity-50 disabled:cursor-not-allowed relative"
              disabled={isLoading || loading}
            >
              {isLoading || loading ? (
                <>
                  <span className="opacity-0">Sign In</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 The Chronicle. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
