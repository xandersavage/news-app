"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Type,
} from "lucide-react";
import { Article } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "./ArticleCard";

interface ArticleViewProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onArticleClick: (article: Article) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  relatedArticles,
  onBack,
  onArticleClick,
}) => {
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [shareOpen, setShareOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const textSizeClasses = {
    small: "text-base",
    medium: "text-lg",
    large: "text-xl",
  } as const;

  const increaseTextSize = () => {
    if (textSize === "small") setTextSize("medium");
    else if (textSize === "medium") setTextSize("large");
  };

  const decreaseTextSize = () => {
    if (textSize === "large") setTextSize("medium");
    else if (textSize === "medium") setTextSize("small");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#1E2124] transition-colors">
      <div className="bg-white dark:bg-[#1E2124] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Articles</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Badge className="bg-[#007BFF] hover:bg-[#0056b3] mb-4">
            {article.category}
          </Badge>
          <h1 className="text-gray-900 dark:text-white mb-6 font-serif">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{formatDate(article.publishDate)}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <button
                onClick={decreaseTextSize}
                disabled={textSize === "small"}
                className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                A-
              </button>
              <button
                onClick={increaseTextSize}
                disabled={textSize === "large"}
                className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                A+
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShareOpen(!shareOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              {shareOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300">
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                    <span>Facebook</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    <span>Twitter</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300">
                    <Link2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full object-cover"
          />
        </div>

        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-[#007BFF] rounded-r">
          <p className="text-gray-700 dark:text-gray-300 italic">
            {article.summary}
          </p>
        </div>

        <div
          className={`prose dark:prose-invert max-w-none ${textSizeClasses[textSize]}`}
        >
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {article.content}
          </p>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-gray-900 dark:text-white mb-8 font-serif">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  onClick={onArticleClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ArticleView;
