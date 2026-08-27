import { Prisma } from "@prisma/client";
import { pick } from "./text";
import { media } from "./paths";
import { prisma } from "./prisma";

export {
  blocks,
  clean,
  docUrl,
  embeddable,
  paragraphs,
  pick,
  real,
  type Block,
} from "./text";
export { BASE, href, media } from "./paths";

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

/**
 * Rows from a collection, or [] if the query fails.
 *
 * Same reasoning as `row()`: a database that is briefly unreachable should cost
 * a section, not the page. Without this the homepage and the news list are the
 * only two routes that 500 on a blip, because they are the only two that query
 * a collection — every other page goes through `row()` and degrades quietly.
 */
export async function many(
  table: string,
  args?: Record<string, unknown>,
): Promise<Row[]> {
  try {
    return ((await delegate(table).findMany(args)) ?? []) as Row[];
  } catch {
    return [];
  }
}

/** How many rows a collection has, or 0 if the query fails. */
export async function count(table: string): Promise<number> {
  try {
    return (await delegate(table).count()) as number;
  } catch {
    return 0;
  }
}

/** The real values of `prefix1..prefixN`, in order, skipping gaps. */
export function series(r: Record<string, unknown>, prefix: string, n: number): string[] {
  const out: string[] = [];
  for (let i = 1; i <= n; i++) {
    const v = pick(r[`${prefix}${i}`]);
    if (v) out.push(v);
  }
  return out;
}

/** The same, for upload columns — returns URLs this app can serve. */
export function gallery(r: Record<string, unknown>, prefix: string, n: number): string[] {
  const out: string[] = [];
  for (let i = 1; i <= n; i++) {
    const v = media(pick(r[`${prefix}${i}`]));
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}
