"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  FolderOpen,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  getDashboardStats,
  getCategoryStats,
  getRecentArticles,
  getPublishingTrends,
  type DashboardStats,
  type CategoryStats,
  type RecentArticle,
  type PublishingTrend,
} from "@/actions/DashboardActions";
import { useRouter } from "next/navigation";

export const DashboardOverview: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [trends, setTrends] = useState<PublishingTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [statsData, categoriesData, articlesData, trendsData] =
          await Promise.all([
            getDashboardStats(),
            getCategoryStats(),
            getRecentArticles(5),
            getPublishingTrends(7),
          ]);

        setStats(statsData);
        setCategoryStats(categoriesData);
        setRecentArticles(articlesData);
        setTrends(trendsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Articles",
      value: stats?.totalArticles || 0,
      icon: FileText,
      change: `${stats?.articlesThisWeek || 0} this week`,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Published",
      value: stats?.publishedArticles || 0,
      icon: CheckCircle,
      change: `${Math.round(
        ((stats?.publishedArticles || 0) / (stats?.totalArticles || 1)) * 100
      )}% of total`,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Drafts",
      value: stats?.draftArticles || 0,
      icon: Clock,
      change: "Awaiting review",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Categories",
      value: stats?.totalCategories || 0,
      icon: FolderOpen,
      change: `${categoryStats.length} active`,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-blue-100">
          Here's what's happening with your news platform today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publishing Trends Chart */}
        <Card className="p-6 lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Publishing Activity
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last 7 days
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {trends.map((trend, index) => {
              const total = trend.published + trend.drafts;
              const publishedPercent =
                total > 0 ? (trend.published / total) * 100 : 0;
              const date = new Date(trend.date);
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "short",
              });

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {dayName},{" "}
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {total} article{total !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex gap-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${publishedPercent}%` }}
                      title={`${trend.published} published`}
                    />
                    <div
                      className="bg-orange-500 transition-all"
                      style={{ width: `${100 - publishedPercent}%` }}
                      title={`${trend.drafts} drafts`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-400">
                Published
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-400">Drafts</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Articles
          </h3>
          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-2 px-2 py-2 rounded transition-colors"
                  onClick={() =>
                    router.push(`/admin/dashboard/articles/${article.id}/edit`)
                  }
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 flex-1">
                      {article.title}
                    </p>
                    <Badge
                      variant={
                        article.status === "published" ? "default" : "secondary"
                      }
                      className={
                        article.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs"
                      }
                    >
                      {article.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {article.category_name} · {article.author_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(article.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No articles yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Articles by Category
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Distribution of published content
            </p>
          </div>
        </div>
        {categoryStats.length > 0 ? (
          <div className="space-y-4">
            {categoryStats.map((category) => (
              <div key={category.slug}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} article{category.count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {category.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No categories with published articles yet</p>
          </div>
        )}
      </Card>
    </div>
  );
};
