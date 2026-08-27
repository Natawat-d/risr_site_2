import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallToAction, DocList, Embed, PageHero, Section } from "@/components/site/blocks";
import { docUrl, embeddable, row } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * The three policy documents in the footer.
 *
 * They live in the `links` table as `box1`, `box2`, `box3` — three unlabelled
 * URL columns, in a fixed order the admin form does not explain. That order is
 * declared here so the footer and this page agree, and so the next person to
 * touch it can see what `box2` is without opening a Drive link to find out.
 */
const POLICIES = {
  aqi: { box: "box1", title: "Air quality policy", eyebrow: "Policy" },
  "data-protection": { box: "box2", title: "Personal data protection", eyebrow: "Policy" },
  "child-safeguarding": { box: "box3", title: "Child safeguarding", eyebrow: "Policy" },
} as const;

type Slug = keyof typeof POLICIES;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = POLICIES[(await params).slug as Slug];
  return { title: p?.title ?? "Policy" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug as Slug;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  const links = await row("links");
  const url = docUrl(links[policy.box]);
  if (!url) notFound();

  return (
    <>
      <PageHero eyebrow={policy.eyebrow} title={policy.title} />

      <Section>
        <Embed url={embeddable(url)} title={policy.title} />
        <div style={{ marginTop: "1.25rem" }}>
          <DocList docs={[{ label: `${policy.title} — open the document`, url }]} />
        </div>
      </Section>

      <CallToAction
        title="Questions about this policy?"
        body="The school office will direct you to whoever owns it."
        links={[{ label: "Contact us", href: "/contact_us" }]}
      />
    </>
  );
}
