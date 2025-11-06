import React, { useState } from "react";
import { Save, Eye, Upload, Calendar } from "lucide-react";
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
import { categories } from "../../data/mockData";
import { Card } from "../ui/card";

export const ArticleForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishDate, setPublishDate] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    if (f) setCoverFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      fd.append("excerpt", summary);
      fd.append("categoryId", category);
      if (coverFile) fd.append("coverImage", coverFile);
      if (status === "published") fd.append("isPublished", "on");
      if (status === "draft" && publishDate)
        fd.append("publishDate", publishDate);

      const res = await fetch("/api/articles", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error || "Failed to save article");
      } else {
        setSuccessMessage("Article saved successfully");
        // optionally reset form fields
        setTitle("");
        setSlug("");
        setCategory("");
        setAuthor("");
        setSummary("");
        setContent("");
        setCoverFile(null);
      }
    } catch (err) {
      console.error("Save article error:", err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900 dark:text-white">Create New Article</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            type="submit"
            form="article-form"
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Article
          </Button>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          {/* Title and Slug */}
          <div className="space-y-4 mb-6">
            <div>
              <Label
                htmlFor="title"
                className="text-gray-700 dark:text-gray-300"
              >
                Article Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title..."
                className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="slug"
                className="text-gray-700 dark:text-gray-300"
              >
                URL Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono"
                required
              />
            </div>
          </div>

          {/* Category and Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label
                htmlFor="category"
                className="text-gray-700 dark:text-gray-300"
              >
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select category" />
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

            <div>
              <Label
                htmlFor="author"
                className="text-gray-700 dark:text-gray-300"
              >
                Author
              </Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <Label
              htmlFor="summary"
              className="text-gray-700 dark:text-gray-300"
            >
              Summary
            </Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of the article..."
              className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              rows={3}
              required
            />
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <Label className="text-gray-700 dark:text-gray-300">
              Featured Image
            </Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                PNG, JPG or WebP (max. 2MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 border-gray-300 dark:border-gray-600"
                onClick={handleFileChoose}
              >
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                name="coverImage"
                accept="image/*"
                className="hidden"
              />
              {coverFile && (
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Selected: {coverFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <Label
              htmlFor="content"
              className="text-gray-700 dark:text-gray-300"
            >
              Article Content
            </Label>
            <div className="mt-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
              {/* Editor Toolbar */}
              <div className="flex items-center gap-2 p-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    B
                  </span>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span className="italic text-gray-700 dark:text-gray-300">
                    I
                  </span>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span className="underline text-gray-700 dark:text-gray-300">
                    U
                  </span>
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
                <button
                  type="button"
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                >
                  H1
                </button>
                <button
                  type="button"
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                >
                  H2
                </button>
                <button
                  type="button"
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                >
                  Quote
                </button>
              </div>
              {/* Editor Area */}
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your article..."
                className="border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-h-[400px] focus:ring-0"
                required
              />
            </div>
          </div>
        </Card>

        {errorMessage && (
          <div className="mt-4 text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 text-sm text-green-700 dark:text-green-300">
            {successMessage}
          </div>
        )}

        {/* Publishing Options */}
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-4">
            Publishing Options
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="status"
                className="text-gray-700 dark:text-gray-300"
              >
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="publishDate"
                className="text-gray-700 dark:text-gray-300"
              >
                Publish Date
              </Label>
              <div className="relative mt-1">
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
