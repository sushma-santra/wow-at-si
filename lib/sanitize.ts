// lib/sanitize.ts
// Plain-text sanitizer — no HTML allowed in posts or comments.
// Avoids isomorphic-dompurify / jsdom which break in Vercel's CJS runtime
// due to ESM-only transitive dependencies.

export function sanitizeContent(content: string): string {
  // Strip all HTML tags
  const noHtml = content.replace(/<[^>]*>/g, "");

  // Decode common HTML entities to their text equivalents
  const decoded = noHtml
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&nbsp;/gi, " ");

  // Re-escape < and > so the output is always safe plain text
  return decoded.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export function validateContent(content: string): {
  valid: boolean;
  error?: string;
  sanitized?: string;
} {
  if (!content || typeof content !== "string") {
    return { valid: false, error: "Content must be provided" };
  }

  const trimmed = content.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Content cannot be empty" };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: "Content cannot exceed 5000 characters" };
  }

  const sanitized = sanitizeContent(trimmed);

  if (sanitized.length === 0) {
    return { valid: false, error: "Content appears to be empty after sanitization" };
  }

  return { valid: true, sanitized };
}
