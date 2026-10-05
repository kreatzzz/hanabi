import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getPostBySlug } from "@/lib/blog/data";

function secretsMatch(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret") ?? "";
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const expectedSecret = process.env.PAYLOAD_PREVIEW_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "Preview is not configured." },
      { status: 503 },
    );
  }
  if (!slug || !secretsMatch(secret, expectedSecret)) {
    return NextResponse.json(
      { error: "Invalid preview request." },
      { status: 401 },
    );
  }

  const post = await getPostBySlug(slug, true);
  if (!post)
    return NextResponse.json({ error: "Post not found." }, { status: 404 });

  (await draftMode()).enable();
  return NextResponse.redirect(new URL(`/blog/${post.slug}`, request.url));
}
