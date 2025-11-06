import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "all";
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "10");

    const supabase = await createClient();

    // Select article fields including foreign keys (category_id, author_id)
    let query = supabase
      .from("articles")
      .select(
        `id, title, slug, cover_image, excerpt, published, publish_date, created_at, category_id, author_id`,
        { count: "exact" }
      );

    if (status !== "all") {
      if (status === "published") query = query.eq("published", true);
      else if (status === "draft")
        query = query.eq("published", false).is("publish_date", null);
      else if (status === "scheduled")
        query = query.eq("published", false).not("publish_date", "is", null);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching articles", error);
      return NextResponse.json({ data: [], total: 0 }, { status: 500 });
    }

    const rows = (data || []) as Array<{
      id: string;
      title: string;
      slug: string;
      cover_image: string | null;
      excerpt: string | null;
      published: boolean;
      publish_date: string | null;
      created_at: string;
      category_id: string | null;
      author_id: string | null;
    }>;

    // Collect unique category and author ids to batch fetch related records
    const categoryIds = Array.from(
      new Set(rows.map((r) => r.category_id).filter(Boolean) as string[])
    );
    const authorIds = Array.from(
      new Set(rows.map((r) => r.author_id).filter(Boolean) as string[])
    );

    const categoryResult = categoryIds.length
      ? await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds)
      : { data: [] as Array<{ id: string; name: string }>, error: null };

    const profileResult = authorIds.length
      ? await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", authorIds)
      : { data: [] as Array<{ id: string; full_name: string }>, error: null };

    const categories = categoryResult.data || [];
    const profiles = profileResult.data || [];

    const categoryMap: Record<string, string> = categories.reduce((acc, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {} as Record<string, string>);

    const profileMap: Record<string, string> = profiles.reduce((acc, p) => {
      acc[p.id] = p.full_name;
      return acc;
    }, {} as Record<string, string>);

    const articles = rows.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      image: a.cover_image || null,
      category: a.category_id
        ? categoryMap[a.category_id] || "Uncategorized"
        : "Uncategorized",
      author: a.author_id ? profileMap[a.author_id] || "Unknown" : "Unknown",
      publishDate: a.publish_date || a.created_at,
      status: a.published
        ? "published"
        : a.publish_date
        ? "scheduled"
        : "draft",
      excerpt: a.excerpt || null,
    }));

    return NextResponse.json({ data: articles, total: count || 0 });
  } catch (err) {
    console.error("API error GET /api/admin/articles", err);
    return NextResponse.json({ data: [], total: 0 }, { status: 500 });
  }
}
