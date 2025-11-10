"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Article } from "@/types";
import { articleService } from "@/services/articleService";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleView from "@/components/articles/ArticleView";

const ArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedArticle = await articleService.getArticleBySlug(slug);

        if (!fetchedArticle) {
          setError("Article not found");
        } else {
          setArticle(fetchedArticle);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const getRelatedArticles = async (article: Article): Promise<Article[]> => {
    if (!article) return [];

    const related = await articleService.getRelatedArticles(
      article.id,
      article.categoryId,
      4
    );

    return related;
  };

  const handleArticleClick = (article: Article) => {
    router.push(`/articles/${article.slug}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-[#1E2124]">
          <Header currentCategory={null} onCategoryClick={() => {}} />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading article...
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  if (error || !article) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-[#1E2124]">
          <Header currentCategory={null} onCategoryClick={() => {}} />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Article Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "The article you're looking for doesn't exist."}
              </p>
              <button
                onClick={handleBack}
                className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Go Back Home
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#1E2124]">
        <Header currentCategory={null} onCategoryClick={() => {}} />
        <ArticleView
          article={article}
          onBack={handleBack}
          onArticleClick={handleArticleClick}
          getRelatedArticles={getRelatedArticles}
        />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default ArticlePage;
