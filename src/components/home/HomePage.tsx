"use client";

import React from "react";
import { Article } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

interface HomePageProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  categoryFilter: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  onArticleClick,
  categoryFilter,
}) => {
  const featuredArticle = articles.find((a) => a.featured);
  const otherArticles = articles.filter((a) => !a.featured);

  // Get unique categories from articles
  const availableCategories = Array.from(
    new Set(articles.map((a) => a.category))
  ).filter(Boolean);

  const getArticlesByCategory = (category: string) => {
    return otherArticles.filter((a) => a.category === category).slice(0, 6);
  };

  // If category filter is applied
  if (categoryFilter) {
    const filteredArticles = articles.filter(
      (a) => a.category === categoryFilter
    );

    return (
      <main className="min-h-screen bg-white dark:bg-[#1E2124] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 font-serif">
            {categoryFilter}
          </h1>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={onArticleClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Default homepage view
  return (
    <main className="min-h-screen bg-white dark:bg-[#1E2124] transition-colors">
      {/* Featured Article */}
      {featuredArticle && (
        <section className="bg-white dark:bg-[#1E2124] border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ArticleCard
              article={featuredArticle}
              variant="featured"
              onClick={onArticleClick}
            />
          </div>
        </section>
      )}

      {/* Latest Stories */}
      <section className="bg-white dark:bg-[#1E2124]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-serif">
            Latest Stories
          </h2>
          {otherArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {otherArticles.slice(0, 6).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={onArticleClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No articles available yet.
              </p>
            </div>
          )}

          {/* Category Sections */}
          {availableCategories.slice(0, 4).map((category) => {
            const categoryArticles = getArticlesByCategory(category);
            if (categoryArticles.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
                    {category}
                  </h2>
                  <button
                    className="text-[#007BFF] hover:underline"
                    onClick={() => onArticleClick(categoryArticles[0])}
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryArticles.slice(0, 4).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="compact"
                      onClick={onArticleClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
