import { PrismaClient } from "@prisma/client";

/**
 * Read-only client against the original site's database.
 *
 * risr_site2 owns no schema and runs no migrations: content is edited in the
 * existing admin at /risr/admin, and this app only presents it. That keeps one
 * editor for the school while two designs run side by side, and means nothing
 * here can corrupt the live site's data.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
