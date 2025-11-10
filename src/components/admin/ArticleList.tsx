import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, Loader2 } from "lucide-react";
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
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status) {
    case "published":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {statusText}
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {statusText}
        </span>
      );
    case "scheduled":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {statusText}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {statusText}
        </span>
      );
  }
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

  const handleDeleteSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditClick = (articleId: string) => {
    router.push(`/admin/dashboard/articles/${articleId}/edit`);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Articles ({total})
        </h1>
        <Button
          onClick={() => router.push("/admin/dashboard/create")}
          className="bg-[#007BFF] hover:bg-[#0056b3] text-white shadow-md transition-colors"
        >
          Create New Article
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search titles or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 rounded p-3">
          {error}
        </div>
      )}

      {/* Loading state for initial load */}
      {loading && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading articles...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && !error && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 border rounded-xl bg-white dark:bg-gray-800">
          <p className="text-lg font-medium mb-2">No articles found</p>
          <p className="text-sm">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first article to get started"}
          </p>
        </div>
      )}

      {/* Articles Table */}
      {articles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">
                {articles.length === 0
                  ? 0
                  : `${(page - 1) * pageSize + 1}-${Math.min(
                      page * pageSize,
                      total
                    )}`}
              </span>{" "}
              of <span className="font-medium">{total}</span> articles
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-gray-300 dark:border-gray-600 min-w-[100px]"
              >
                {loading && page > 1 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Previous"
                )}
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                Page {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="border-gray-300 dark:border-gray-600 min-w-[100px]"
              >
                {loading && page < totalPages ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
