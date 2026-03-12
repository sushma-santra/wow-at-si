// lib/rateLimit.ts
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const LIMITS = {
  POST_CREATE: {
    maxRequests: 5,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  COMMENT_CREATE: {
    maxRequests: 10,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  REACTION_CREATE: {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

export async function checkRateLimit(
  sessionId: string,
  action: keyof typeof LIMITS
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const limit = LIMITS[action];
  const hashedSessionId = createHash("sha256").update(sessionId).digest("hex");

  const now = new Date();
  const resetAt = new Date(now.getTime() + limit.windowMs);

  // Get or create rate limit record
  const rateLimitRecord = await prisma.rateLimit.findUnique({
    where: {
      sessionId_action: {
        sessionId: hashedSessionId,
        action,
      },
    },
  });

  // If record doesn't exist or window has passed, create new record
  if (!rateLimitRecord || new Date(rateLimitRecord.resetAt) < now) {
    await prisma.rateLimit.upsert({
      where: {
        sessionId_action: {
          sessionId: hashedSessionId,
          action,
        },
      },
      update: {
        count: 1,
        resetAt,
      },
      create: {
        sessionId: hashedSessionId,
        action,
        count: 1,
        resetAt,
      },
    });

    return {
      allowed: true,
      remaining: limit.maxRequests - 1,
      resetAt,
    };
  }

  // Check if limit exceeded
  if (rateLimitRecord.count >= limit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(rateLimitRecord.resetAt),
    };
  }

  // Increment count
  await prisma.rateLimit.update({
    where: {
      id: rateLimitRecord.id,
    },
    data: {
      count: rateLimitRecord.count + 1,
    },
  });

  return {
    allowed: true,
    remaining: limit.maxRequests - (rateLimitRecord.count + 1),
    resetAt: new Date(rateLimitRecord.resetAt),
  };
}

// Cleanup old rate limit records (run periodically)
export async function cleanupRateLimits() {
  const now = new Date();
  await prisma.rateLimit.deleteMany({
    where: {
      resetAt: {
        lt: now,
      },
    },
  });
}
