// app/api/posts/[postId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            _count: {
              select: {
                reactions: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        reactions: {
          select: {
            type: true,
          },
        },
        report: {
          select: {
            reason: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Count reactions by type
    const reactionCounts = post.reactions.reduce(
      (acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json(
      {
        ...post,
        reactionCounts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // This would be called by admin only (middleware should enforce)
    const post = await prisma.post.delete({
      where: { id: params.postId },
    });

    // Log to audit trail
    await prisma.auditLog.create({
      data: {
        action: "POST_REMOVED",
        postId: params.postId,
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
