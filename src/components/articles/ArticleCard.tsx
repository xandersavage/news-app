"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Article } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
  onClick: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "default",
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate estimated read time based on content length
  const calculateReadTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
  };

  const readTime = calculateReadTime(article.content);

  if (variant === "featured") {
    return (
      <div
        onClick={() => onClick(article)}
        className="group relative overflow-hidden rounded-lg sm:rounded-xl cursor-pointer bg-white dark:bg-gray-900 transition-transform hover:scale-[1.02]"
      >
        {/* Responsive aspect ratio: taller on mobile, wider on desktop */}
        <div className="aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Gradient overlay - stronger on mobile for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent sm:from-black/80 sm:via-black/40" />

        {/* Content - responsive padding and spacing */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
          <Badge className="bg-[#007BFF] hover:bg-[#0056b3] mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm">
            {article.category}
          </Badge>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 group-hover:text-gray-200 transition-colors font-serif line-clamp-3 sm:line-clamp-2">
            {article.title}
          </h2>

          <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-2">
            {article.summary}
          </p>

          {/* Meta info - stacked on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{article.author}</span>
              <span className="hidden sm:inline">•</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{formatDate(article.publishDate)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        onClick={() => onClick(article)}
        className="group cursor-pointer flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Badge
            variant="outline"
            className="mb-1 sm:mb-2 border-[#007BFF] text-[#007BFF] text-xs"
          >
            {article.category}
          </Badge>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-[#007BFF] dark:group-hover:text-[#007BFF] transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span className="truncate">{article.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readTime} min</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(article)}
      className="group cursor-pointer bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-lg hover:border-[#007BFF]"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 sm:p-5">
        <Badge
          variant="outline"
          className="mb-2 sm:mb-3 border-[#007BFF] text-[#007BFF] text-xs sm:text-sm"
        >
          {article.category}
        </Badge>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#007BFF] dark:group-hover:text-[#007BFF] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <span className="truncate">{article.author}</span>
          <span>•</span>
          <span className="whitespace-nowrap">
            {formatDate(article.publishDate)}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{readTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
