"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, Loader2, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import Image from "next/image";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { deleteArticle } from "@/actions/ArticleActions";

type Article = {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  category: string;
  author: string;
  publishDate: string;
  status: string;
  excerpt?: string | null;
};

async function fetchArticles(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));

  const res = await fetch(`/api/admin/articles?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

const getCategoryClasses = (category: string): string => {
  switch (category) {
    case "Politics":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-400";
    case "Technology":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-400";
    case "Business":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-400";
    case "Sports":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-400";
    case "Culture":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-400";
    case "Science":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 border-cyan-400";
    case "World":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-400";
  }
};

const getStatusBadge = (status: string) => {
  // Normalize status - treat anything that's not "published" as "draft"
  const normalizedStatus = status === "published" ? "published" : "draft";
  const statusText =
    normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  if (normalizedStatus === "published") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        {statusText}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
      {statusText}
    </span>
  );
};

export const ArticleList: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (searchQuery) {
        setIsSearching(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await fetchArticles({
          search: searchQuery,
          status: statusFilter,
          page,
          pageSize,
        });
        if (!mounted) return;
        setArticles(data.data || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err) {
        console.error("Failed to load articles", err);
        if (mounted) {
          setError("Failed to load articles");
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsSearching(false);
        }
      }
    };

    const t = setTimeout(load, 250);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [searchQuery, statusFilter, page, pageSize, refreshTrigger]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteSuccess = (deletedArticleId: string) => {
    // Optimistic update - remove article from UI immediately
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== deletedArticleId)
    );
    setTotal((prevTotal) => Math.max(0, prevTotal - 1));

    // Also trigger a refresh to ensure consistency
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditClick = (articleId: string) => {
    router.push(`/admin/dashboard/articles/${articleId}/edit`);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          All Articles ({total})
        </h1>
        <Button
          onClick={() => router.push("/admin/dashboard/create")}
          className="bg-[#007BFF] hover:bg-[#0056b3] text-white shadow-md transition-colors w-full sm:w-auto text-sm sm:text-base whitespace-nowrap"
        >
          Create New Article
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search titles or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {/* Loading state for initial load */}
      {loading && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading articles...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && !error && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 border rounded-xl bg-white dark:bg-gray-800">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-2">No articles found</p>
          <p className="text-sm">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first article to get started"}
          </p>
        </div>
      )}

      {/* Desktop Table View - Hidden on Mobile */}
      {articles.length > 0 && (
        <>
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Title
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Category
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Author
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Publish Date
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow
                      key={article.id}
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="text-gray-900 dark:text-white max-w-md">
                        <div className="flex items-center gap-3">
                          {article.image ? (
                            <Image
                              src={article.image}
                              alt={article.title}
                              width={48}
                              height={48}
                              className="rounded object-cover w-12 h-12"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {article.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              /{article.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getCategoryClasses(article.category)}
                        >
                          {article.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {article.author}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {article.status === "draft" ? (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Not published
                          </span>
                        ) : (
                          formatDate(article.publishDate)
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(article.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(article.id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] p-2 h-auto"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DeleteArticleDialog
                            articleId={article.id}
                            deleteAction={deleteArticle}
                            onDeleteSuccess={handleDeleteSuccess}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View - Shown on Mobile/Tablet */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Article Header with Image */}
                  <div className="flex gap-3">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={64}
                        height={64}
                        className="rounded object-cover w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                        /{article.slug}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge
                          variant="outline"
                          className={`${getCategoryClasses(
                            article.category
                          )} text-xs px-2 py-0.5`}
                        >
                          {article.category}
                        </Badge>
                        {getStatusBadge(article.status)}
                      </div>
                    </div>
                  </div>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1 pr-2">
                      <p className="text-xs truncate">
                        <span className="font-medium">Author:</span>{" "}
                        {article.author}
                      </p>
                      <p className="text-xs truncate">
                        <span className="font-medium">
                          {article.status === "draft"
                            ? "Created:"
                            : "Published:"}
                        </span>{" "}
                        {article.status === "draft" ? (
                          <span className="italic">Not published</span>
                        ) : (
                          formatDate(article.publishDate)
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(article.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF] border-gray-300 dark:border-gray-600 h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <DeleteArticleDialog
                        articleId={article.id}
                        deleteAction={deleteArticle}
                        onDeleteSuccess={handleDeleteSuccess}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:px-6 sm:py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium">
                {articles.length === 0
                  ? 0
                  : `${(page - 1) * pageSize + 1}-${Math.min(
                      page * pageSize,
                      total
                    )}`}
              </span>{" "}
              of <span className="font-medium">{total}</span>
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-gray-300 dark:border-gray-600 flex-1 sm:flex-none sm:min-w-[90px] text-xs sm:text-sm"
              >
                {loading && page > 1 ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Loading</span>
                  </>
                ) : (
                  "Previous"
                )}
              </Button>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-1 sm:px-2 whitespace-nowrap font-medium">
                {page}/{totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="border-gray-300 dark:border-gray-600 flex-1 sm:flex-none sm:min-w-[90px] text-xs sm:text-sm"
              >
                {loading && page < totalPages ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Loading</span>
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
