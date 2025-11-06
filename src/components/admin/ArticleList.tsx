import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, MoreVertical, Filter } from "lucide-react";
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

// Fetch articles from server API instead of using mock data
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

export const ArticleList: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
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
      } catch (err) {
        console.error("Failed to load articles", err);
        setError("Failed to load articles");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const t = setTimeout(load, 250);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [searchQuery, statusFilter, page, pageSize]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900 dark:text-white">All Articles</h1>
        <Button
          onClick={() => router.push("/admin/dashboard/create")}
          className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
        >
          Create New Article
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
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
            <option value="scheduled">Scheduled</option>
          </select>

          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Articles Table */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 rounded p-3">
          {error}
        </div>
      )}
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
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate">{article.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 truncate">
                          {article.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    <Badge
                      variant="outline"
                      className="border-[#007BFF] text-[#007BFF]"
                    >
                      {article.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {article.author}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {formatDate(article.publishDate)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(article.status)}>
                      {article.status.charAt(0).toUpperCase() +
                        article.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] dark:hover:text-[#007BFF]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span>
              {articles.length === 0
                ? 0
                : `${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    total
                  )}`}
            </span>{" "}
            of <span>{total}</span> articles
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border-gray-300 dark:border-gray-600"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * pageSize >= total || loading}
              onClick={() => setPage((p) => p + 1)}
              className="border-gray-300 dark:border-gray-600"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
