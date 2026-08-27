import type { Metadata } from "next";
import { CallToAction, DocList, Embed, PageHero, Section } from "@/components/site/blocks";
import { docUrl, embeddable, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("newsletter");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The newsletter row is seventeen `box` columns holding alternating link and
 * label — box1 is a URL, box2 is "August & september 2025", and so on. The odd
 * one at the end has no label.
 *
 * The school's note was: call it "Newsletter", not "Monthly Newsletter", and
 * stop leading with issues more than a year old. Deleting them is the school's
 * call and cannot be done from here anyway, so instead the recent issues are
 * the page and the rest becomes an archive underneath. Nothing is lost and the
 * top of the page is current.
 */
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * The last month/year named in a label — "October to December 2024" is a
 * December 2024 issue, not an October one. Returns null when the label names
 * no date, in which case the issue is treated as current rather than hidden.
 */
function issueDate(label: string): Date | null {
  const year = label.match(/\b(20\d{2})\b/g)?.pop();
  if (!year) return null;
  const lower = label.toLowerCase();
  let month = 11; // no month named — count it from the end of that year
  let at = -1;
  MONTHS.forEach((name, k) => {
    const pos = lower.lastIndexOf(name);
    if (pos > at) {
      at = pos;
      month = k;
    }
  });
  return new Date(Number(year), month, 1);
}

export default async function Page() {
  const r = await row("newsletter");

  const issues = [];
  for (let n = 1; n <= 17; n += 2) {
    const url = docUrl(r[`box${n}`]);
    if (!url) continue;
    // The columns run out at 17, so the last link has no label column to go
    // with it. It is a real issue with no name, not a broken one — archived
    // rather than led with, and rather than dropped.
    const label = pick(r[`box${n + 1}`]);
    issues.push({
      label: label || "Undated issue",
      url,
      date: label ? issueDate(label) : new Date(0),
    });
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 12);
  const current = issues.filter((i) => !i.date || i.date >= cutoff);
  const archive = issues.filter((i) => i.date && i.date < cutoff);

  const latest = current[0] ?? issues[0];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.newsle_banner))}
      />

      {latest ? (
        <Section eyebrow="Latest issue" title={latest.label}>
          <Embed url={embeddable(latest.url)} title={latest.label} />
        </Section>
      ) : null}

      {current.length > 1 ? (
        <Section tone="sand" eyebrow="This year" title="Recent issues">
          <DocList docs={current.slice(1)} />
        </Section>
      ) : null}

      {archive.length ? (
        <Section eyebrow="Archive" title="Earlier issues">
          <DocList docs={archive} />
        </Section>
      ) : null}

      <CallToAction
        title="Day-to-day news"
        body="Shorter updates go on the news page as they happen."
        links={[
          { label: "News", href: "/news" },
          { label: "School calendar", href: "/school_calendar" },
        ]}
      />
    </>
  );
}
