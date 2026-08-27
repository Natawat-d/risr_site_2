import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Contact form submissions.
 *
 * This is the only write in the application: an INSERT into `contact_form`
 * with `status = 0` (unread), which is exactly what the old PHP handler did and
 * what the existing admin inbox at /risr/admin/contact reads. No row is ever
 * updated or deleted from here.
 *
 * Worth knowing: on the live site this form does nothing at all —
 * `contact_us/send_email.php` is commented out in its entirety, so every
 * enquiry made through risr.ac.th since that change has gone nowhere.
 */
const LIMITS = { name: 120, email: 160, telephone: 40, subject: 200, comment: 4000 };

function field(form: FormData, key: keyof typeof LIMITS): string {
  return (form.get(key) ?? "").toString().trim().slice(0, LIMITS[key]);
}

export async function POST(request: Request) {
  const form = await request.formData();

  // A field no person can see and no browser fills in. Cheap, and the only
  // thing standing between a public form and a spam run — the original had
  // nothing at all, and its `contact_form` table carries the link-spam rows to
  // prove it.
  if ((form.get("website") ?? "").toString().trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = field(form, "name");
  const email = field(form, "email");
  const subject = field(form, "subject");
  const comment = field(form, "comment");
  const telephone = field(form, "telephone");

  if (!name || !email || !subject) {
    return NextResponse.json(
      { ok: false, error: "Name, email and subject are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }

  try {
    await prisma.contactForm.create({
      data: { name, email, telephone, subject, comment, status: 0 },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not save that. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
