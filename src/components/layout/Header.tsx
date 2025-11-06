"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { categories } from "@/data/mockData";

interface HeaderProps {
  onCategoryClick: (category: string | null) => void;
  currentCategory: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onCategoryClick,
  currentCategory,
}) => {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleAdminClick = () => {
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1E2124] border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => onCategoryClick(null)}
                className="text-gray-900 dark:text-white transition-colors"
              >
                <span
                  className="font-serif italic tracking-tight"
                  style={{ fontSize: "1.75rem" }}
                >
                  The Chronicle
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleAdminClick}
                className="px-3 py-1.5 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-sm hover:opacity-90 transition"
                aria-label="Admin"
              >
                Admin →
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleAdminClick}
                className="px-2.5 py-1.5 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs hover:opacity-90 transition"
                aria-label="Admin"
              >
                Admin
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              autoFocus
            />
          </div>
        </div>
      )}

      <nav className="hidden md:block bg-white dark:bg-[#1E2124]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 h-12">
            <button
              onClick={() => onCategoryClick(null)}
              className={`text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors ${
                currentCategory === null ? "text-[#007BFF]" : ""
              }`}
            >
              All
            </button>
            {categories.slice(0, 7).map((category) => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className={`text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors ${
                  currentCategory === category ? "text-[#007BFF]" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1E2124] border-b border-gray-200 dark:border-gray-800">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  onCategoryClick(null);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors ${
                  currentCategory === null ? "text-[#007BFF]" : ""
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryClick(category);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 text-gray-700 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors ${
                    currentCategory === category ? "text-[#007BFF]" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
