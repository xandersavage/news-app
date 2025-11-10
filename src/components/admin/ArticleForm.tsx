"use client";

import React, { useState, useEffect } from "react";
import { Save, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { categories } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle } from "@/actions/ArticleActions";

interface ArticleFormProps {
  article?: any;
  mode?: "create" | "edit";
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  mode = "create",
}) => {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishDate, setPublishDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load article data in edit mode
  useEffect(() => {
    if (isEditMode && article) {
      console.log("Loading article data:", article);

      setTitle(article.title || "");
      setSlug(article.slug || "");

      // Handle category - match by name or ID
      const categoryName = article.categories?.name || "";
      if (categoryName && categories.includes(categoryName)) {
        setCategory(categoryName);
      } else if (article.category_id) {
        // Fallback to category_id if name doesn't match
        setCategory(article.category_id);
      }

      setSummary(article.excerpt || "");
      setContent(article.content || "");
      setStatus(article.published ? "published" : "draft");
      setFeatured(article.featured || false);

      if (article.publish_date) {
        const date = new Date(article.publish_date);
        const formattedDate = date.toISOString().split("T")[0];
        setPublishDate(formattedDate);
      }

      if (article.cover_image) {
        setExistingImageUrl(article.cover_image);
        setCoverPreview(article.cover_image);
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isEditMode, article]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Auto-generate slug from title
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generatedSlug);
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChoose = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      if (f.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      setCoverFile(f);
      setExistingImageUrl(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(f);

      toast.success("Image uploaded successfully");
    }
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Image removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation with toast feedback
    if (!title.trim()) {
      toast.error("Title is required", {
        description: "Please enter a title for your article",
      });
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required", {
        description: "Please write some content for your article",
      });
      return;
    }

    if (!category) {
      toast.error("Category is required", {
        description: "Please select a category for your article",
      });
      return;
    }

    if (!summary.trim()) {
      toast.error("Summary is required", {
        description: "Please write a brief summary for your article",
      });
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading(
      isEditMode ? "Updating article..." : "Saving article..."
    );

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      fd.append("excerpt", summary);
      fd.append("categoryId", category);

      if (coverFile) {
        fd.append("coverImage", coverFile);
      } else if (existingImageUrl) {
        fd.append("keepExistingImage", "true");
      }

      if (status === "published") fd.append("isPublished", "on");
      if (featured) fd.append("isFeatured", "on");
      if (publishDate) fd.append("publishDate", publishDate);

      let result;
      if (isEditMode && article) {
        result = await updateArticle(article.id, fd);
      } else {
        result = await createArticle(fd);
      }

      toast.dismiss(loadingToast);

      if (!result.success) {
        toast.error(
          result.error || `Failed to ${isEditMode ? "update" : "save"} article`,
          {
            description: "Please check your input and try again",
          }
        );
      } else {
        toast.success(
          isEditMode
            ? "Article updated successfully!"
            : "Article saved successfully!",
          {
            description:
              status === "published"
                ? "Your article is now live"
                : "Your draft has been saved",
          }
        );

        // Redirect to articles list after a short delay
        setTimeout(() => {
          router.push("/admin/dashboard/articles");
        }, 1000);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Save article error:", err);
      toast.error("An unexpected error occurred", {
        description:
          "Please try again or contact support if the problem persists",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while article data is being loaded
  if (isEditMode && isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? "Edit Article" : "Create New Article"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode
            ? "Update your article details below"
            : "Fill in the details below to create and publish your article"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the title and basic details of your article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Article Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter a compelling title..."
                className="mt-1.5"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                A clear, descriptive title helps readers find your content
              </p>
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">
                URL Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className="mt-1.5 font-mono text-sm"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This will be the URL: /articles/{slug || "your-slug-here"}
              </p>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div>
              <Label htmlFor="summary">
                Summary <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a brief summary that will appear in article previews..."
                className="mt-1.5 resize-none"
                rows={3}
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {summary.length}/200 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Featured Image Card */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>
              Upload a cover image for your article (PNG, JPG, or WebP, max 2MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!coverPreview ? (
              <div
                onClick={handleFileChoose}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Click to upload image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    PNG, JPG or WebP (max. 2MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                {coverFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {coverFile.name} ({(coverFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
                {!coverFile && existingImageUrl && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Current image (no changes)
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
            <CardDescription>
              Write your article content using the rich text editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TiptapEditor content={content} onChange={setContent} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {Math.ceil(
                (content
                  .replace(/<[^>]*>/g, "")
                  .split(/\s+/)
                  .filter(Boolean).length || 0) / 200
              )}{" "}
              min read
            </p>
          </CardContent>
        </Card>

        {/* Publishing Options Card */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
            <CardDescription>
              Choose when and how to publish your article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <Label htmlFor="status">Publication Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Draft</span>
                        <span className="text-xs text-gray-500">
                          Save without publishing
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Published</span>
                        <span className="text-xs text-gray-500">
                          Make live immediately
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Publish Date */}
              <div>
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use current date
                </p>
              </div>
            </div>

            {/* Featured Article */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Featured Article
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                Featured articles will be highlighted on the homepage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#007BFF] hover:bg-[#0056b3]"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? "Update Article" : "Save Article"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
