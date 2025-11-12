"use server";

import { createClient } from "@/utils/supabase/server";
import type { Article } from "@/data/mockData";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

type CreateArticleResult =
  | { success: true; article: Article }
  | { success: false; error: string };

type UpdateArticleResult =
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
  excludeArticleId?: string,
  maxAttempts = 5
) {
  let slug = baseSlug;
  for (let i = 0; i < maxAttempts; i++) {
    const query = supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    // Exclude current article when updating
    if (excludeArticleId) {
      query.neq("id", excludeArticleId);
    }

    const { data } = await query.maybeSingle();
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

  const bucket = "articles";
  const ext = file.name.split(".").pop() || "jpg";
  const path = `covers/${slug}-${Date.now()}.${ext}`;

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

function getStoragePathFromUrl(
  publicUrl: string,
  bucketName: string
): string | null {
  try {
    const pattern = `/object/public/${bucketName}/`;
    const index = publicUrl.indexOf(pattern);

    if (index !== -1) {
      const path = publicUrl.substring(index + pattern.length);
      console.log(`[STORAGE PATH] Extracted path: ${path}`);
      return path;
    }

    const parts = publicUrl.split("public/");
    if (parts.length > 1) {
      const afterPublic = parts[1];
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

async function deleteStorageFile(
  supabase: SupabaseClient,
  imageUrl: string
): Promise<void> {
  const bucketName = "articles";
  const storagePath = getStoragePathFromUrl(imageUrl, bucketName);

  if (storagePath) {
    console.log(
      `[STORAGE DELETE] Attempting to delete: ${storagePath} from bucket: ${bucketName}`
    );

    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([storagePath]);

    if (storageError) {
      console.error("[STORAGE DELETE ERROR]", storageError);
      console.warn(
        "Storage Cleanup Warning: Failed to delete image from bucket."
      );
    } else {
      console.log("[STORAGE DELETE SUCCESS]");
    }
  }
}

export async function createArticle(
  formData: FormData
): Promise<CreateArticleResult> {
  try {
    const supabase = await createClient();

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
        const { data: catBySlug } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categoryInput)
          .limit(1)
          .maybeSingle();
        if (catBySlug && catBySlug.id) {
          categoryId = catBySlug.id;
        } else {
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
      if (
        error.code === "23505" ||
        String(error.message).toLowerCase().includes("duplicate")
      ) {
        const altSlug = await ensureUniqueSlug(
          supabase,
          baseSlug,
          undefined,
          10
        );
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

    revalidatePath("/admin/dashboard/articles");
    return { success: true, article: data };
  } catch (err) {
    console.error("createArticle error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while creating the article.",
    };
  }
}

// export async function updateArticle(
//   articleId: string,
//   formData: FormData
// ): Promise<UpdateArticleResult> {
//   try {
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       return { success: false, error: "Authentication error" };
//     }

//     // Fetch the existing article
//     const { data: existingArticle, error: fetchError } = await supabase
//       .from("articles")
//       .select("*")
//       .eq("id", articleId)
//       .single();

//     if (fetchError || !existingArticle) {
//       return { success: false, error: "Article not found" };
//     }

//     const title = (formData.get("title") as string) || "";
//     const content = (formData.get("content") as string) || "";
//     const excerpt = (formData.get("excerpt") as string) || "";
//     const categoryInput = (formData.get("categoryId") as string) || null;
//     const isFeatured = formData.get("isFeatured") === "on";
//     const isPublished = formData.get("isPublished") === "on";
//     const publishDate = (formData.get("publishDate") as string) || null;
//     const coverFile = (formData.get("coverImage") as File) || null;
//     const keepExistingImage = formData.get("keepExistingImage") === "true";

//     if (!title || !content) {
//       return { success: false, error: "Title and content are required." };
//     }

//     let categoryId: string | null = null;
//     if (categoryInput) {
//       const { data: catById } = await supabase
//         .from("categories")
//         .select("id")
//         .eq("id", categoryInput)
//         .limit(1)
//         .maybeSingle();
//       if (catById && catById.id) {
//         categoryId = catById.id;
//       } else {
//         const { data: catBySlug } = await supabase
//           .from("categories")
//           .select("id")
//           .eq("slug", categoryInput)
//           .limit(1)
//           .maybeSingle();
//         if (catBySlug && catBySlug.id) {
//           categoryId = catBySlug.id;
//         } else {
//           const { data: catByName } = await supabase
//             .from("categories")
//             .select("id")
//             .eq("name", categoryInput)
//             .limit(1)
//             .maybeSingle();
//           if (catByName && catByName.id) categoryId = catByName.id;
//         }
//       }

//       if (!categoryId) {
//         return { success: false, error: "Selected category does not exist." };
//       }
//     }

//     // Handle slug - only regenerate if title changed
//     let slug = existingArticle.slug;
//     if (title !== existingArticle.title) {
//       const baseSlug = slugify(title);
//       slug = await ensureUniqueSlug(supabase, baseSlug, articleId);
//     }

//     // Handle cover image
//     let coverUrl: string | null = existingArticle.cover_image;

//     if (coverFile && coverFile.size > 0) {
//       // Delete old image if it exists
//       if (existingArticle.cover_image) {
//         await deleteStorageFile(supabase, existingArticle.cover_image);
//       }

//       // Upload new image
//       try {
//         coverUrl = await uploadCoverIfPresent(supabase, coverFile, slug);
//       } catch (err) {
//         console.error("Cover upload failed:", err);
//         return { success: false, error: "Failed to upload cover image." };
//       }
//     } else if (!keepExistingImage && existingArticle.cover_image) {
//       // User removed the image
//       await deleteStorageFile(supabase, existingArticle.cover_image);
//       coverUrl = null;
//     }

//     const updatePayload: Record<string, unknown> = {
//       title,
//       slug,
//       content,
//       excerpt,
//       featured: isFeatured,
//       published: isPublished,
//       category_id: categoryId,
//       cover_image: coverUrl,
//       updated_at: new Date().toISOString(),
//     };

//     if (publishDate) {
//       updatePayload.publish_date = publishDate;
//     }

//     const { data, error } = await supabase
//       .from("articles")
//       .update(updatePayload)
//       .eq("id", articleId)
//       .select()
//       .single();

//     if (error) {
//       console.error("Supabase update error:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to update article",
//       };
//     }

//     revalidatePath("/admin/dashboard/articles");
//     revalidatePath(`/articles/${slug}`);
//     return { success: true, article: data };
//   } catch (err) {
//     console.error("updateArticle error:", err);
//     return {
//       success: false,
//       error: "An unexpected error occurred while updating the article.",
//     };
//   }
// }

export async function getArticleById(articleId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories (id, name, slug)
      `
      )
      .eq("id", articleId)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("getArticleById error:", err);
    return null;
  }
}

export async function deleteArticle(
  articleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "User not authenticated or session expired.",
      };
    }

    const { data: articleCheck, error: checkError } = await supabase
      .from("articles")
      .select("author_id, cover_image")
      .eq("id", articleId)
      .single();

    if (checkError || !articleCheck) {
      return {
        success: false,
        error: "Article not found or access denied.",
      };
    }

    const imageUrl = articleCheck.cover_image;

    if (imageUrl) {
      await deleteStorageFile(supabase, imageUrl);
    }

    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    if (deleteError) {
      console.error("Database Delete Error:", deleteError);
      return {
        success: false,
        error: "Failed to delete article from database.",
      };
    }

    revalidatePath("/admin/dashboard/articles");
    console.log(
      "[DELETE ARTICLE] Successfully deleted article and cleaned up resources"
    );

    return { success: true };
  } catch (error) {
    console.error("[DELETE ARTICLE ERROR]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateArticle(
  articleId: string,
  formData: FormData
): Promise<UpdateArticleResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Authentication error" };
    }

    // Fetch the existing article
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (fetchError || !existingArticle) {
      return { success: false, error: "Article not found" };
    }

    const title = (formData.get("title") as string) || "";
    const content = (formData.get("content") as string) || "";
    const excerpt = (formData.get("excerpt") as string) || "";
    const categoryInput = (formData.get("categoryId") as string) || null;
    const isFeatured = formData.get("isFeatured") === "on";
    const isPublished = formData.get("isPublished") === "on";
    const publishDate = (formData.get("publishDate") as string) || null;
    const coverFile = (formData.get("coverImage") as File) || null;
    const keepExistingImage = formData.get("keepExistingImage") === "true";

    if (!title || !content) {
      return { success: false, error: "Title and content are required." };
    }

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
        const { data: catBySlug } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categoryInput)
          .limit(1)
          .maybeSingle();
        if (catBySlug && catBySlug.id) {
          categoryId = catBySlug.id;
        } else {
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

    // Handle slug - only regenerate if title changed
    let slug = existingArticle.slug;
    if (title !== existingArticle.title) {
      const baseSlug = slugify(title);
      slug = await ensureUniqueSlug(supabase, baseSlug, articleId);
    }

    // Handle cover image
    let coverUrl: string | null = existingArticle.cover_image;

    if (coverFile && coverFile.size > 0) {
      // Delete old image if it exists
      if (existingArticle.cover_image) {
        await deleteStorageFile(supabase, existingArticle.cover_image);
      }

      // Upload new image
      try {
        coverUrl = await uploadCoverIfPresent(supabase, coverFile, slug);
      } catch (err) {
        console.error("Cover upload failed:", err);
        return { success: false, error: "Failed to upload cover image." };
      }
    } else if (!keepExistingImage && existingArticle.cover_image) {
      // User removed the image
      await deleteStorageFile(supabase, existingArticle.cover_image);
      coverUrl = null;
    }

    const updatePayload: Record<string, unknown> = {
      title,
      slug,
      content,
      excerpt,
      featured: isFeatured,
      published: isPublished,
      category_id: categoryId,
      cover_image: coverUrl,
      updated_at: new Date().toISOString(),
    };

    if (publishDate) {
      updatePayload.publish_date = publishDate;
    }

    // Perform the update WITHOUT .select() to avoid RLS issues
    const { error: updateError } = await supabase
      .from("articles")
      .update(updatePayload)
      .eq("id", articleId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return {
        success: false,
        error: updateError.message || "Failed to update article",
      };
    }

    // Fetch the updated article separately (this will respect RLS policies)
    const { data: updatedArticle, error: fetchUpdatedError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();

    // If we can't fetch the article back, that's okay - the update succeeded
    // Return a minimal article object with the data we know
    const articleData = updatedArticle || {
      id: articleId,
      title,
      slug,
      content,
      excerpt,
      featured: isFeatured,
      published: isPublished,
      category_id: categoryId,
      cover_image: coverUrl,
      author_id: existingArticle.author_id,
      created_at: existingArticle.created_at,
      updated_at: updatePayload.updated_at,
      publish_date: publishDate || existingArticle.publish_date,
    };

    revalidatePath("/admin/dashboard/articles");
    revalidatePath(`/articles/${slug}`);

    return { success: true, article: articleData as Article };
  } catch (err) {
    console.error("updateArticle error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while updating the article.",
    };
  }
}
