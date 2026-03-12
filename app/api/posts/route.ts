// app/api/posts/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateContent } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Get posts with count of reactions
    const posts = await prisma.post.findMany({
      where: { isReported: false },
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
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    const total = await prisma.post.count({
      where: { isReported: false },
    });

    return NextResponse.json(
      {
        posts,
        pagination: {
          page,
          pageSize,
          total,
          pages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

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
    const rateLimit = await checkRateLimit(sessionId, "POST_CREATE");
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
    const { content, category } = body;

    // Validate content
    const validation = validateContent(content);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["Advice", "Workplace", "Mental Health", "General"];
    const selectedCategory = validCategories.includes(category)
      ? category
      : "General";

    // Create post (COMPLETELY ANONYMOUS - no user reference)
    const post = await prisma.post.create({
      data: {
        content: validation.sanitized!,
        category: selectedCategory,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
