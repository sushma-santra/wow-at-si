// app/api/reactions/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

const VALID_REACTION_TYPES = ["SUPPORT", "AGREE", "HUG", "COMMENT"];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get session ID from cookie for rate limiting
    const sessionId = request.cookies.get("next-auth.session-token")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(sessionId, "REACTION_CREATE");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Parse body
    const body = await request.json();
    const { type, postId, commentId } = body;

    // Validate input
    if (!type || !VALID_REACTION_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    if (!postId && !commentId) {
      return NextResponse.json(
        { error: "Either postId or commentId must be provided" },
        { status: 400 }
      );
    }

    // Verify post/comment exists
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
    }

    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      if (!comment) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }
    }

    // Create reaction (COMPLETELY ANONYMOUS)
    const reaction = await prisma.reaction.create({
      data: {
        type,
        postId: postId || null,
        commentId: commentId || null,
      },
    });

    return NextResponse.json(reaction, { status: 201 });
  } catch (error) {
    console.error("Error creating reaction:", error);
    return NextResponse.json(
      { error: "Failed to create reaction" },
      { status: 500 }
    );
  }
}
