import type { Metadata } from "next";
import { CallToAction, Embed, PageHero, Section } from "@/components/site/blocks";
import { docUrl, embeddable, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("school_calendar");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * Two things live in this row: the year's calendar as a document (a poster
 * image plus a Drive link, twice over, each with a `display_calendar` switch),
 * and up to four Google Calendar embeds with switches of their own.
 *
 * The embeds have no names anywhere in the schema, so the page does not invent
 * any: the first enabled one is shown, and the rest are offered as links into
 * Google Calendar. Naming them needs a label column, which is a change to
 * risr-site's schema and admin rather than a guess here.
 */
export default async function Page() {
  const r = await row("school_calendar");

  const posters = [1, 2]
    .map((n) => ({
      // The stored labels read "DOWNLOAD School Calendar 2026-2027" — the verb
      // was the link text on the old page. Here the card has its own button,
      // so the label is just the name of the thing.
      label:
        pick(r[`box${n}`]).replace(/^download\s+/i, "") || `School calendar ${n}`,
      url: docUrl(r[`link_calender${n}`]),
      image: media(pick(r[`calendar_photo${n}`])),
      shown: r[`display_calendar${n}`] === true,
    }))
    .filter((p) => p.shown && (p.url || p.image));

  // Switches 3–6 gate link_1..link_4.
  const feeds = [1, 2, 3, 4]
    .map((n) => ({ url: pick(r[`link_${n}`]), shown: r[`display_calendar${n + 2}`] === true }))
    .filter((f) => f.shown && f.url)
    .map((f) => f.url);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.calendar_banner))}
      />

      {feeds.length ? (
        <Section eyebrow="Live" title="What's on">
          {/* Each enabled feed gets its own frame. They are not named anywhere
              in the schema, so none is invented — a Google Calendar shows its
              own title inside the frame, which is more accurate than a guess. */}
          <div className={styles.feeds}>
            {feeds.map((url, i) => (
              <Embed key={url} url={url} title={`School calendar ${i + 1}`} />
            ))}
          </div>
        </Section>
      ) : null}

      {posters.length ? (
        <Section tone="sand" eyebrow="Download" title="Term dates at a glance">
          <div className={styles.posters}>
            {posters.map((p) => (
              <article key={p.label} className={styles.poster}>
                {p.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.image} alt={p.label} loading="lazy" />
                ) : null}
                <div className={styles.posterBody}>
                  <h3>{p.label}</h3>
                  {p.url ? (
                    <a className="btn btn--navy" href={p.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {posters[0]?.url ? (
        <Section eyebrow="Full calendar">
          <Embed url={embeddable(posters[0].url)} title={posters[0].label} />
        </Section>
      ) : null}

      <CallToAction
        title="Dates for admissions"
        body="Application deadlines and assessment dates are handled separately by the admissions office."
        links={[
          { label: "How to apply", href: "/apply_now" },
          { label: "Contact us", href: "/contact_us" },
        ]}
      />
    </>
  );
}
