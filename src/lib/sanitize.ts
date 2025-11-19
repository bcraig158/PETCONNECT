// src/lib/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * Used for bio and embed content from users
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "iframe",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "width", "height", "frameborder", "allow", "allowfullscreen"],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize HTML for embeds (more permissive for iframes)
 */
export function sanitizeEmbedHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["iframe", "div"],
    ALLOWED_ATTR: [
      "src",
      "width",
      "height",
      "frameborder",
      "allow",
      "allowfullscreen",
      "class",
      "style",
    ],
    ALLOW_DATA_ATTR: false,
  });
}

