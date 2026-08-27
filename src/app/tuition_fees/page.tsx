import type { Metadata } from "next";
import { CallToAction, DocList, Embed, PageHero, Section } from "@/components/site/blocks";
import { docUrl, embeddable, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("tuition_fees");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * Two fee schedules, each with its own `display_tui` switch so the school can
 * publish next year's alongside this year's and turn the old one off. Both are
 * Google Drive documents; the current one is shown inline and any others are
 * offered as links.
 */
export default async function Page() {
  const r = await row("tuition_fees");

  const schedules = [1, 2]
    .map((n) => ({
      heading: pick(r[`header_tui${n}`]) || `Tuition & fees ${n}`,
      url: docUrl(r[`link_tui${n}`]),
      shown: r[`display_tui${n}`] === true,
    }))
    .filter((s) => s.url && s.shown);

  const [current, ...others] = schedules;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.tui_banner))}
      />

      {current ? (
        <Section eyebrow="Current" title={current.heading}>
          <Embed url={embeddable(current.url)} title={current.heading} />
        </Section>
      ) : (
        <Section>
          <p className="lede">
            The fee schedule is being updated. Admissions can send you the current
            figures in the meantime.
          </p>
        </Section>
      )}

      {others.length ? (
        <Section tone="sand" eyebrow="Also published" title="Other years">
          <DocList docs={others.map((s) => ({ label: s.heading, url: s.url }))} />
        </Section>
      ) : null}

      <CallToAction
        title="What the fee covers"
        body="Admissions can talk you through payment schedules, sibling discounts and what sits outside the tuition fee."
        links={[
          { label: "Contact admissions", href: "/contact_us" },
          { label: "How to apply", href: "/apply_now" },
        ]}
      />
    </>
  );
}
