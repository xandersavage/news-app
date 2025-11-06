"use client";

import React, { useMemo, useState } from "react";
import { mockArticles, Article } from "@/data/mockData";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "@/components/home/HomePage";
import ArticleView from "@/components/articles/ArticleView";

const Page = () => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles = useMemo(() => mockArticles, []);

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [] as Article[];
    return articles.filter(
      (a) =>
        a.id !== selectedArticle.id &&
        (a.category === selectedArticle.category || a.featured)
    );
  }, [articles, selectedArticle]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#1E2124]">
        <Header
          currentCategory={categoryFilter}
          onCategoryClick={(c) => {
            setCategoryFilter(c);
            setSelectedArticle(null);
          }}
        />
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            relatedArticles={relatedArticles}
            onBack={() => setSelectedArticle(null)}
            onArticleClick={(a) => setSelectedArticle(a)}
          />
        ) : (
          <HomePage
            articles={articles}
            onArticleClick={(a) => setSelectedArticle(a)}
            categoryFilter={categoryFilter}
          />
        )}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Page;
