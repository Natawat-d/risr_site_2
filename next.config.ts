import type { NextConfig } from "next";

// Served under a sub-path beside the original site (/risr2) while both run in
// parallel. Baked at build time, so it must be present as a build arg too.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  // Read-only Prisma against the original site's database; keep the engine out
  // of the bundle.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
