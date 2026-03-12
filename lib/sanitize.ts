// lib/sanitize.ts
import DOMPurify from "isomorphic-dompurify";
import sanitizeHtml from "sanitize-html";

export function sanitizeContent(content: string): string {
  // First pass: sanitize HTML
  const cleaned = sanitizeHtml(content, {
    allowedTags: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
    allowedAttributes: {
      a: ["href"],
    },
    allowedSchemes: ["http", "https"],
    disallowedTagsMode: "discard",
  });

  // Second pass: DOMPurify for XSS prevention
  const purified = DOMPurify.sanitize(cleaned, { ALLOWED_TAGS: [] });

  return purified;
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
