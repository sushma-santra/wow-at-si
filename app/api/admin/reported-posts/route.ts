// app/api/admin/reported-posts/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reviewed = searchParams.get("reviewed");

    const reportedPosts = await prisma.reportedPost.findMany({
      where: reviewed !== null ? { reviewed: reviewed === "true" } : {},
      include: {
        post: {
          select: {
            id: true,
            content: true,
            category: true,
            createdAt: true,
            _count: {
              select: {
                reactions: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reportedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching reported posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch reported posts" },
      { status: 500 }
    );
  }
}
