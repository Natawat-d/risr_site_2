import type { Metadata } from "next";
import { ProgramPage } from "@/components/templates/program";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const SLUG = "extended_day_programs";
const copy = copyFor(SLUG);

export const metadata: Metadata = { title: copy.title, description: copy.lede };

export default function Page() {
  return <ProgramPage slug={SLUG} />;
}
