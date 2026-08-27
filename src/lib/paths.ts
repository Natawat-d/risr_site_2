/*
 * URL helpers.
 *
 * Separate from `content.ts` because these are the only two things a client
 * component needs, and `content.ts` imports Prisma. Importing it from a
 * `"use client"` file pulls `@prisma/client` into the browser bundle, where
 * `Prisma.dmmf` does not exist — the page then throws
 * "Cannot read properties of undefined (reading 'datamodel')" on hydration,
 * which is exactly how this file came to exist.
 */

export const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** A stored upload filename → the URL this app serves it from. */
export function media(name: unknown): string {
  const s = (name ?? "").toString().trim();
  return s ? `${BASE}/media/${encodeURIComponent(s)}` : "";
}

/**
 * Prefix an app-internal path.
 *
 * Only for raw `<a href>`, `<form action>` and `fetch()`. `next/link`,
 * `router.push`, `next/image` and `redirect()` add the base path themselves, so
 * wrapping those produces `/risr2/risr2/…` and a 404.
 */
export function href(path: string): string {
  return path.startsWith("/") ? `${BASE}${path}` : path;
}
