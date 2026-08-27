import { readFile, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Serve a file from the shared uploads volume.
 *
 * The pictures belong to the original site's CMS and live on a bind mount that
 * both apps see. Serving them here rather than linking to /risr/admin/uploads
 * keeps this app self-sufficient, so it can become the real site without every
 * image URL still pointing at the thing it replaced.
 *
 * A `.webp` sibling is served to browsers that accept it — the batch conversion
 * already produced 492 of them, and it is the difference between a 5 MB
 * photograph and 148 KB.
 */
const DIR = process.env.UPLOAD_DIR || "./uploads";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  // basename() so "../../etc/passwd" cannot escape the media directory.
  const name = basename(decodeURIComponent(file));
  const ext = extname(name).toLowerCase();
  if (!TYPES[ext]) return new NextResponse("Not found", { status: 404 });

  const wantsWebp = (req.headers.get("accept") ?? "").includes("image/webp");
  const candidates = wantsWebp && ext !== ".webp" ? [`${name}.webp`, name] : [name];

  for (const candidate of candidates) {
    const path = join(DIR, candidate);
    try {
      const info = await stat(path);
      if (!info.isFile()) continue;
      const body = await readFile(path);
      return new NextResponse(new Uint8Array(body), {
        headers: {
          "Content-Type": candidate.endsWith(".webp") ? "image/webp" : TYPES[ext],
          "Content-Length": String(info.size),
          "Cache-Control": "public, max-age=86400",
          Vary: "Accept",
        },
      });
    } catch {
      // try the next candidate
    }
  }
  return new NextResponse("Not found", { status: 404 });
}
