"use client";

import React, { useEffect, useState } from "react";
import { Article } from "@/types";
import { articleService } from "@/services/articleService";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";
import ArticleView from "@/components/articles/ArticleView";

const Page = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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

  // Get related articles when an article is selected
  const getRelatedArticles = async (article: Article): Promise<Article[]> => {
    if (!article) return [];

    const related = await articleService.getRelatedArticles(
      article.id,
      article.categoryId,
      4
    );

    return related;
  };

  const handleArticleClick = async (article: Article) => {
    setSelectedArticle(article);
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
          onCategoryClick={(c) => {
            setCategoryFilter(c);
            setSelectedArticle(null);
          }}
          // categories={categories}
        />
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            onArticleClick={handleArticleClick}
            getRelatedArticles={getRelatedArticles}
          />
        ) : (
          <HomePage
            articles={articles}
            onArticleClick={handleArticleClick}
            categoryFilter={categoryFilter}
          />
        )}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Page;
