import { PrismaClient } from "@prisma/client";

/**
 * Client against the original site's database.
 *
 * risr_site2 owns no schema and runs no migrations: content is edited in the
 * existing admin at /risr/admin, and this app only presents it. That keeps one
 * editor for the school while two designs run side by side.
 *
 * It reads everything and writes exactly one thing: an INSERT into
 * `contact_form` when someone submits the contact page, which lands in the same
 * admin inbox as a submission from the original site. There is no UPDATE or
 * DELETE anywhere in this codebase, so no existing row can be changed or lost
 * from here — grep for `.update`/`.delete` before that stops being true.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
