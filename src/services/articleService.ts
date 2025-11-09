// src/services/articleService.ts
// Create this new file to handle all article-related API calls

import { createClient } from "@/utils/supabase/client";
import { ArticleWithRelations, Article, transformArticle } from "@/types";

export class ArticleService {
  private supabase = createClient();

  /**
   * Fetch all published articles with categories and authors
   */
  async getAllArticles(): Promise<Article[]> {
    try {
      // First, try without joins to see if basic query works
      const { data, error } = await this.supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("publish_date", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return [];
      }

      if (!data || data.length === 0) {
        console.log("No articles found in database");
        return [];
      }

      console.log(`Found ${data.length} articles`);

      // Now fetch categories and authors separately
      const categoryIds = [...new Set(data.map((a) => a.category_id))];
      const authorIds = [...new Set(data.map((a) => a.author_id))];

      const [categoriesResult, authorsResult] = await Promise.all([
        this.supabase.from("categories").select("*").in("id", categoryIds),
        this.supabase.from("authors").select("*").in("id", authorIds),
      ]);

      const categoriesMap = new Map(
        (categoriesResult.data || []).map((c) => [c.id, c])
      );
      const authorsMap = new Map(
        (authorsResult.data || []).map((a) => [a.id, a])
      );

      // Combine the data
      const articlesWithRelations = data.map((article) => ({
        ...article,
        categories: categoriesMap.get(article.category_id),
        authors: authorsMap.get(article.author_id),
      }));

      return articlesWithRelations.map(transformArticle);
    } catch (err) {
      console.error("Exception in getAllArticles:", err);
      return [];
    }
  }

  /**
   * Fetch a single article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await this.supabase
      .from("articles")
      .select(
        `
        *,
        categories (*),
        authors (*)
      `
      )
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return transformArticle(data as ArticleWithRelations);
  }

  /**
   * Fetch a single article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await this.supabase
      .from("articles")
      .select(
        `
        *,
        categories (*),
        authors (*)
      `
      )
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return transformArticle(data as ArticleWithRelations);
  }

  /**
   * Fetch featured article
   */
  async getFeaturedArticle(): Promise<Article | null> {
    const { data, error } = await this.supabase
      .from("articles")
      .select(
        `
        *,
        categories (*),
        authors (*)
      `
      )
      .eq("published", true)
      .eq("featured", true)
      .order("publish_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching featured article:", error);
      return null;
    }

    return transformArticle(data as ArticleWithRelations);
  }

  /**
   * Fetch articles by category
   */
  async getArticlesByCategory(categoryId: string): Promise<Article[]> {
    const { data, error } = await this.supabase
      .from("articles")
      .select(
        `
        *,
        categories (*),
        authors (*)
      `
      )
      .eq("published", true)
      .eq("category_id", categoryId)
      .order("publish_date", { ascending: false });

    if (error) {
      console.error("Error fetching articles by category:", error);
      return [];
    }

    return (data as ArticleWithRelations[]).map(transformArticle);
  }

  /**
   * Fetch related articles (same category, excluding current article)
   */
  async getRelatedArticles(
    articleId: string,
    categoryId: string,
    limit: number = 4
  ): Promise<Article[]> {
    const { data, error } = await this.supabase
      .from("articles")
      .select(
        `
        *,
        categories (*),
        authors (*)
      `
      )
      .eq("published", true)
      .eq("category_id", categoryId)
      .neq("id", articleId)
      .order("publish_date", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching related articles:", error);
      return [];
    }

    return (data as ArticleWithRelations[]).map(transformArticle);
  }

  /**
   * Fetch all categories
   */
  async getCategories() {
    const { data, error } = await this.supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data;
  }
}

// Export singleton instance
export const articleService = new ArticleService();
