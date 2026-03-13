// app/api/posts/[postId]/comments/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateContent } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get a stable identifier for rate limiting.
    // NextAuth uses different cookie names in dev (HTTP) vs prod (HTTPS).
    const sessionId =
      request.cookies.get("__Secure-next-auth.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      session.user?.email ||
      null;

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(sessionId, "COMMENT_CREATE");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = await request.json();
    const { content } = body;

    // Validate content
    const validation = validateContent(content);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create comment (COMPLETELY ANONYMOUS - no user reference)
    const comment = await prisma.comment.create({
      data: {
        content: validation.sanitized!,
        postId: params.postId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
