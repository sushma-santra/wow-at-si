// app/api/admin/upload-allowlist/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 }
      );
    }

    // Read file content — strip BOM and normalise line endings
    const raw = await file.text();
    const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Parse CSV — treat PapaParse warnings as non-fatal
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.toLowerCase().trim(),
    });

    // Only fail if we got no rows at all (PapaParse warnings are non-fatal)
    if ((result.data as any[]).length === 0) {
      return NextResponse.json(
        { error: "Failed to parse CSV: no rows found" },
        { status: 400 }
      );
    }

    // Extract and validate emails
    const emails = (result.data as any[])
      .map((row) => row.email?.trim().toLowerCase())
      .filter((email) => email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));

    if (emails.length === 0) {
      return NextResponse.json(
        { error: "No valid emails found in CSV" },
        { status: 400 }
      );
    }

    // Clear existing allowlist
    await prisma.allowedEmail.deleteMany();

    // Add new emails
    const created = await prisma.allowedEmail.createMany({
      data: emails.map((email) => ({ email })),
      skipDuplicates: true,
    });

    // Log to audit trail
    await prisma.auditLog.create({
      data: {
        action: "ALLOWLIST_UPLOADED",
        reason: `Uploaded ${created.count} emails`,
      },
    });

    return NextResponse.json(
      {
        message: "Allowlist uploaded successfully",
        count: created.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading allowlist:", error);
    return NextResponse.json(
      { error: "Failed to upload allowlist" },
      { status: 500 }
    );
  }
}
