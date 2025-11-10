import { getArticleById } from "@/actions/ArticleActions";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return <ArticleForm article={article} mode="edit" />;
}
