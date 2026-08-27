import type { Metadata } from "next";
import { DivisionPage } from "@/components/templates/division";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const SLUG = "high_school";
const copy = copyFor(SLUG);

export const metadata: Metadata = { title: copy.title, description: copy.lede };

export default function Page() {
  return <DivisionPage slug={SLUG} />;
}
