"use server";

import { createClient } from "@/utils/supabase/server";
import type { Article } from "@/data/mockData";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

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
    const publishDate = (formData.get("publishDate") as string) || null;
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

    // Add publish_date to the payload if provided
    if (publishDate) {
      insertPayload.publish_date = publishDate;
    }

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

// --- Utility Function to Extract Storage Path ---
/**
 * Extracts the file path from a Supabase public URL.
 * The path should be relative to the bucket (e.g., 'covers/image.jpg')
 * @param publicUrl The full public URL of the file.
 * @param bucketName The name of the storage bucket.
 * @returns The storage path or null if not found.
 */
function getStoragePathFromUrl(
  publicUrl: string,
  bucketName: string
): string | null {
  try {
    // Supabase public URLs typically follow this pattern:
    // https://[project-ref].supabase.co/storage/v1/object/public/[bucket-name]/[file-path]

    // Look for the pattern: /object/public/{bucketName}/
    const pattern = `/object/public/${bucketName}/`;
    const index = publicUrl.indexOf(pattern);

    if (index !== -1) {
      // Extract everything after the bucket name
      const path = publicUrl.substring(index + pattern.length);
      console.log(`[STORAGE PATH] Extracted path: ${path}`);
      return path;
    }

    // Fallback: try splitting by 'public/' and then by bucket name
    const parts = publicUrl.split("public/");
    if (parts.length > 1) {
      const afterPublic = parts[1];
      // Remove bucket name if it's at the start
      if (afterPublic.startsWith(`${bucketName}/`)) {
        const path = afterPublic.substring(bucketName.length + 1);
        console.log(`[STORAGE PATH] Extracted path (fallback): ${path}`);
        return path;
      }
    }

    console.error("[STORAGE PATH] Could not extract path from URL:", publicUrl);
    return null;
  } catch (error) {
    console.error("[STORAGE PATH] Error parsing URL:", error);
    return null;
  }
}

// --- CORE SERVER ACTION: DELETE ARTICLE ---
/**
 * Deletes an article by ID, ensuring user authentication, cleaning up the
 * associated cover image from Supabase Storage, and revalidating the cache.
 * @param articleId The ID of the article to delete.
 */
export async function deleteArticle(articleId: string) {
  const supabase = await createClient();

  // 1. Authentication Check (Always first for mutations!)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated or session expired.");
  }

  // 2. Fetch Data, Check Authorization, and Get Image URL
  // We must retrieve the image URL BEFORE deleting the database row.
  const { data: articleCheck, error: checkError } = await supabase
    .from("articles")
    .select("author_id, cover_image")
    .eq("id", articleId)
    .single();

  if (checkError || !articleCheck) {
    throw new Error("Article not found or access denied.");
  }

  // 3. Image Deletion (Cleanup step)
  const imageUrl = articleCheck.cover_image;

  if (imageUrl) {
    const bucketName = "articles";
    const storagePath = getStoragePathFromUrl(imageUrl, bucketName);

    if (storagePath) {
      console.log(
        `[STORAGE DELETE] Attempting to delete: ${storagePath} from bucket: ${bucketName}`
      );

      const { data: removeData, error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([storagePath]);

      if (storageError) {
        console.error("[STORAGE DELETE ERROR]", storageError);
        console.warn(
          "Storage Cleanup Warning: Failed to delete image from bucket.",
          storageError
        );
      } else {
        console.log("[STORAGE DELETE SUCCESS]", removeData);
      }
    } else {
      console.warn(
        "[STORAGE DELETE] Could not extract storage path from URL:",
        imageUrl
      );
    }
  }

  // 4. Database Deletion
  const { error: deleteError } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId);

  if (deleteError) {
    console.error("Database Delete Error:", deleteError);
    throw new Error("Failed to delete article from database.");
  }

  // 5. Client Refresh
  // Revalidates the cache for the articles list to reflect the deletion instantly.
  revalidatePath("/admin/dashboard/articles");
  console.log(
    "[DELETE ARTICLE] Successfully deleted article and cleaned up resources"
  );
}
