"use server";

import { createClient } from "@/utils/supabase/server";
import type { Article } from "@/data/mockData";
import type { SupabaseClient } from "@supabase/supabase-js";

type CreateArticleResult =
  | { success: true; article: Article }
  | { success: false; error: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(
  supabase: SupabaseClient,
  baseSlug: string,
  maxAttempts = 5
) {
  let slug = baseSlug;
  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();
    if (!data) return slug;
    // slug exists, append suffix
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
  }
  // last resort
  return `${baseSlug}-${Date.now()}`;
}

async function uploadCoverIfPresent(
  supabase: SupabaseClient,
  file: File | null,
  slug: string
) {
  if (!file) return null;

  // Ensure bucket exists in your Supabase project: 'articles'
  const bucket = "articles";
  const ext = file.name.split(".").pop() || "jpg";
  const path = `covers/${slug}-${Date.now()}.${ext}`;

  // Read file as ArrayBuffer
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, new Uint8Array(buffer), {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(uploadError.message || "Failed to upload cover image");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl || null;
}

export async function createArticle(
  formData: FormData
): Promise<CreateArticleResult> {
  try {
    const supabase = await createClient();

    // Get the currently authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return { success: false, error: "Authentication error" };
    }

    if (!user || !user.id) {
      return {
        success: false,
        error: "You must be signed in to create an article.",
      };
    }

    // Extract fields from the form data
    const title = (formData.get("title") as string) || "";
    const content = (formData.get("content") as string) || "";
    const excerpt = (formData.get("excerpt") as string) || "";
    const categoryInput = (formData.get("categoryId") as string) || null;
    const isFeatured = formData.get("isFeatured") === "on";
    const isPublished = formData.get("isPublished") === "on";
    const coverFile = (formData.get("coverImage") as File) || null;

    if (!title || !content) {
      return { success: false, error: "Title and content are required." };
    }

    // Validate category exists. categoryInput can be id, slug, or name
    let categoryId: string | null = null;
    if (categoryInput) {
      const { data: catById } = await supabase
        .from("categories")
        .select("id")
        .eq("id", categoryInput)
        .limit(1)
        .maybeSingle();
      if (catById && catById.id) {
        categoryId = catById.id;
      } else {
        // try slug
        const { data: catBySlug } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categoryInput)
          .limit(1)
          .maybeSingle();
        if (catBySlug && catBySlug.id) {
          categoryId = catBySlug.id;
        } else {
          // try name
          const { data: catByName } = await supabase
            .from("categories")
            .select("id")
            .eq("name", categoryInput)
            .limit(1)
            .maybeSingle();
          if (catByName && catByName.id) categoryId = catByName.id;
        }
      }

      if (!categoryId) {
        return { success: false, error: "Selected category does not exist." };
      }
    }

    const baseSlug = slugify(title);
    const slug = await ensureUniqueSlug(supabase, baseSlug);

    // If there's a cover image, upload it and get public URL
    let coverUrl: string | null = null;
    if (coverFile) {
      try {
        coverUrl = await uploadCoverIfPresent(supabase, coverFile, slug);
      } catch (err) {
        const e = err as Error;
        console.error("Cover upload failed:", e);
        return { success: false, error: "Failed to upload cover image." };
      }
    }

    const insertPayload: Record<string, unknown> = {
      title,
      slug,
      content,
      excerpt,
      featured: isFeatured,
      published: isPublished,
      category_id: categoryId,
      author_id: user.id,
      cover_image: coverUrl,
    };

    const { data, error } = await supabase
      .from("articles")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // If unique violation on slug, try to generate alternate slug and retry once
      if (
        error.code === "23505" ||
        String(error.message).toLowerCase().includes("duplicate")
      ) {
        const altSlug = await ensureUniqueSlug(supabase, baseSlug, 10);
        insertPayload.slug = altSlug;
        const { data: data2, error: error2 } = await supabase
          .from("articles")
          .insert(insertPayload)
          .select()
          .single();
        if (error2) {
          console.error("Retry insert failed:", error2);
          return {
            success: false,
            error: error2.message || "Failed to create article after retry.",
          };
        }
        return { success: true, article: data2 };
      }
      return {
        success: false,
        error: error.message || "Failed to create article",
      };
    }

    return { success: true, article: data };
  } catch (err) {
    console.error("createArticle error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while creating the article.",
    };
  }
}
