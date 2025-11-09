export interface SupabaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured: boolean;
  published: boolean;
  category_id: string;
  author_id: string;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  publish_date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

// Extended article with joined data
export interface ArticleWithRelations extends SupabaseArticle {
  categories?: Category;
  authors?: Author;
}

// Frontend Article type (transformed for display)
export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryId: string;
  author: string;
  authorId: string;
  publishDate: string;
  image: string;
  summary: string;
  content: string;
  featured: boolean;
  status: "published" | "draft";
}

// Helper function to transform Supabase article to frontend Article
export function transformArticle(article: ArticleWithRelations): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.categories?.name || "Uncategorized",
    categoryId: article.category_id,
    author: article.authors?.name || "Unknown Author",
    authorId: article.author_id,
    publishDate: article.publish_date,
    image: article.cover_image || "/placeholder-image.jpg",
    summary: article.excerpt,
    content: article.content,
    featured: article.featured,
    status: article.published ? "published" : "draft",
  };
}
