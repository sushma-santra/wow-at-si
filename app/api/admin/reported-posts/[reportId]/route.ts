// app/api/admin/reported-posts/[reportId]/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    const body = await request.json();
    const { action } = body; // APPROVED, REMOVED, DISMISSED

    if (!["APPROVED", "REMOVED", "DISMISSED"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Get report
    const report = await prisma.reportedPost.findUnique({
      where: { id: params.reportId },
      include: { post: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // Update report
    const updatedReport = await prisma.reportedPost.update({
      where: { id: params.reportId },
      data: {
        action,
        reviewed: true,
      },
    });

    // If action is REMOVED, delete the post
    if (action === "REMOVED") {
      await prisma.post.delete({
        where: { id: report.postId },
      });

      // Log to audit trail
      await prisma.auditLog.create({
        data: {
          action: "POST_REMOVED",
          postId: report.postId,
          reason: `Report #${params.reportId} - ${report.reason}`,
        },
      });
    } else {
      // Mark as not reported if approved
      if (action === "APPROVED") {
        await prisma.post.update({
          where: { id: report.postId },
          data: { isReported: false },
        });
      }

      // Log to audit trail
      await prisma.auditLog.create({
        data: {
          action: `POST_${action}`,
          postId: report.postId,
        },
      });
    }

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
