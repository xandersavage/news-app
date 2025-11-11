"use server";

import { createClient } from "@/utils/supabase/server";

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  articlesThisWeek: number;
  articlesThisMonth: number;
}

export interface CategoryStats {
  name: string;
  slug: string;
  count: number;
  percentage: number;
}

export interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  created_at: string;
  author_name: string;
  category_name: string;
}

export interface PublishingTrend {
  date: string;
  published: number;
  drafts: number;
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const supabase = await createClient();

    // Get total articles count
    const { count: totalArticles } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    // Get published articles count
    const { count: publishedArticles } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    // Get draft articles count
    const { count: draftArticles } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("published", false);

    // Get total categories count
    const { count: totalCategories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    // Get articles created this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: articlesThisWeek } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    // Get articles created this month
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const { count: articlesThisMonth } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo.toISOString());

    return {
      totalArticles: totalArticles || 0,
      publishedArticles: publishedArticles || 0,
      draftArticles: draftArticles || 0,
      totalCategories: totalCategories || 0,
      articlesThisWeek: articlesThisWeek || 0,
      articlesThisMonth: articlesThisMonth || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  try {
    const supabase = await createClient();

    // Get all articles with their categories
    const { data: articles, error } = await supabase
      .from("articles")
      .select("category_id, categories(name, slug)")
      .eq("published", true);

    if (error) {
      console.error("Error fetching category stats:", error);
      return [];
    }

    // Count articles per category
    const categoryMap = new Map<
      string,
      { name: string; slug: string; count: number }
    >();

    articles?.forEach((article: any) => {
      if (article.categories) {
        const categoryName = article.categories.name;
        const categorySlug = article.categories.slug;

        if (categoryMap.has(categoryName)) {
          categoryMap.get(categoryName)!.count++;
        } else {
          categoryMap.set(categoryName, {
            name: categoryName,
            slug: categorySlug,
            count: 1,
          });
        }
      }
    });

    // Convert to array and calculate percentages
    const totalArticles = articles?.length || 0;
    const categoryStats: CategoryStats[] = Array.from(categoryMap.values())
      .map((cat) => ({
        ...cat,
        percentage:
          totalArticles > 0 ? Math.round((cat.count / totalArticles) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return categoryStats;
  } catch (error) {
    console.error("Error in getCategoryStats:", error);
    return [];
  }
}

export async function getRecentArticles(
  limit: number = 5
): Promise<RecentArticle[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        published,
        created_at,
        categories(name),
        authors(name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent articles:", error);
      return [];
    }

    return (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.published ? "published" : "draft",
      created_at: article.created_at,
      author_name: article.authors?.name || "Unknown Author",
      category_name: article.categories?.name || "Uncategorized",
    }));
  } catch (error) {
    console.error("Error in getRecentArticles:", error);
    return [];
  }
}

export async function getPublishingTrends(
  days: number = 7
): Promise<PublishingTrend[]> {
  try {
    const supabase = await createClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("articles")
      .select("created_at, published")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching publishing trends:", error);
      return [];
    }

    // Group by date
    const trendMap = new Map<string, { published: number; drafts: number }>();

    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split("T")[0];
      trendMap.set(dateStr, { published: 0, drafts: 0 });
    }

    // Count articles per day
    data?.forEach((article: any) => {
      const dateStr = article.created_at.split("T")[0];
      if (trendMap.has(dateStr)) {
        const stats = trendMap.get(dateStr)!;
        if (article.published) {
          stats.published++;
        } else {
          stats.drafts++;
        }
      }
    });

    // Convert to array
    return Array.from(trendMap.entries()).map(([date, stats]) => ({
      date,
      published: stats.published,
      drafts: stats.drafts,
    }));
  } catch (error) {
    console.error("Error in getPublishingTrends:", error);
    return [];
  }
}
