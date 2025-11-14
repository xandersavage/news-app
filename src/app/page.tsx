"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/types";
import { articleService } from "@/services/articleService";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";

const Page = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Fetch articles and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesData, categoriesData] = await Promise.all([
          articleService.getAllArticles(),
          articleService.getCategories(),
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleArticleClick = (article: Article) => {
    // Navigate to the article page using its slug
    router.push(`/articles/${article.slug}`);
  };

  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category);
    // Scroll to top when filtering
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-[#1E2124] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading articles...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#1E2124]">
        <Header
          currentCategory={categoryFilter}
          onCategoryClick={handleCategoryFilter}
        />
        <HomePage
          articles={articles}
          onArticleClick={handleArticleClick}
          categoryFilter={categoryFilter}
          onCategoryFilter={handleCategoryFilter} // ADD THIS
        />
        <Footer onCategoryClick={(category) => setCategoryFilter(category)} />
      </div>
    </ThemeProvider>
  );
};

export default Page;
