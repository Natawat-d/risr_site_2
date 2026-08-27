import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** A stored upload filename → the URL this app serves it from. */
export function media(name: unknown): string {
  const s = (name ?? "").toString().trim();
  return s ? `${BASE}/media/${encodeURIComponent(s)}` : "";
}

/** Prefix an app-internal path. Only for raw <a href>/fetch — next/link adds it. */
export function href(path: string): string {
  return path.startsWith("/") ? `${BASE}${path}` : path;
}

/**
 * Legacy table name → Prisma delegate.
 *
 * The schema is copied from risr-site verbatim, misspellings and all
 * (`midedle` is Middle School), so the two apps read exactly the same rows.
 */
const delegateKey = new Map(
  Prisma.dmmf.datamodel.models.map((m) => [
    m.dbName ?? m.name,
    m.name.charAt(0).toLowerCase() + m.name.slice(1),
  ]),
);

type Row = Record<string, unknown>;

export function delegate(table: string) {
  const key = delegateKey.get(table);
  if (!key) throw new Error(`No Prisma model mapped to table "${table}"`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[key];
}

/** The singleton row for a content table, or {} if it has never been saved. */
export async function row(table: string): Promise<Row> {
  try {
    return ((await delegate(table).findFirst()) ?? {}) as Row;
  } catch {
    return {};
  }
}

/** Plain text from the CMS, as paragraphs. Legacy fields hold no markup. */
export function paragraphs(value: unknown): string[] {
  return (value ?? "")
    .toString()
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * True when a CMS value is worth rendering.
 *
 * Five pages carry `[value-2]`-style placeholders written into the legacy
 * database by an automated attack in 2024. They are live on risr.ac.th today
 * and were carried across faithfully — but a redesign is the right moment to
 * stop printing them, so sections built only from placeholder text are skipped
 * rather than shown to a parent.
 */
export function real(value: unknown): boolean {
  const s = (value ?? "").toString().trim();
  return !!s && !/^\[value-\d+\]$/.test(s);
}

/** First value that is real, else "". */
export function pick(...values: unknown[]): string {
  for (const v of values) if (real(v)) return String(v).trim();
  return "";
}
