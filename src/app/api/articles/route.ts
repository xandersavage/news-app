import { NextResponse } from "next/server";
import { createArticle } from "@/actions/ArticleActions";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await createArticle(formData as FormData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, article: result.article },
      { status: 201 }
    );
  } catch (err) {
    console.error("API /api/articles error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
