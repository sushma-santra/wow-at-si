// app/api/posts/[postId]/report/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    // Parse body
    const body = await request.json();
    const { reason } = body;

    // Validate input
    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
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

    // Check if already reported
    const existingReport = await prisma.reportedPost.findUnique({
      where: { postId: params.postId },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "Post is already reported" },
        { status: 400 }
      );
    }

    // Create report
    const report = await prisma.reportedPost.create({
      data: {
        postId: params.postId,
        reason: reason.trim().substring(0, 500),
      },
    });

    // Mark post as reported
    await prisma.post.update({
      where: { id: params.postId },
      data: { isReported: true },
    });

    // Log to audit trail
    await prisma.auditLog.create({
      data: {
        action: "POST_REPORTED",
        postId: params.postId,
        reason: reason.substring(0, 500),
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error reporting post:", error);
    return NextResponse.json(
      { error: "Failed to report post" },
      { status: 500 }
    );
  }
}
