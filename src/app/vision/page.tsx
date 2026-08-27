import type { Metadata } from "next";
import {
  CallToAction,
  Feature,
  PageHero,
  RichText,
  Section,
} from "@/components/site/blocks";
import { blocks, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("vision");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The `vision` row holds eight boxes with no labels: the seal, the senior pin
 * and the phoenix (1–3), the vision and the mission (4–5), then three lists of
 * learner outcomes (6–8).
 *
 * The three lists are the school's own "head, hands and heart" — the phrase is
 * in `home.home_SCHOOLWIDE` — and they arrive in that order. Naming them is the
 * one piece of framing this page adds; everything else is the school's words.
 * If the school reorders those boxes the headings will be wrong, which is why
 * they are declared here rather than buried in the markup.
 */
const OUTCOMES = [
  { box: "box6", term: "Head", blurb: "How our students think" },
  { box: "box7", term: "Hands", blurb: "How our students work" },
  { box: "box8", term: "Heart", blurb: "How our students treat others" },
] as const;

const SYMBOLS = [
  { box: "box1", photo: 1, term: "The school seal" },
  { box: "box2", photo: 2, term: "The senior pin" },
  { box: "box3", photo: 3, term: "The phoenix" },
] as const;

export default async function Page() {
  const r = await row("vision");
  const photos = gallery(r, "vis_photo", 6);

  const outcomes = OUTCOMES.filter((o) => blocks(r[o.box]).length);
  const symbols = SYMBOLS.filter((s) => blocks(r[s.box]).length);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.vis_banner))}
      />

      <Section tone="navy">
        <div className="split">
          <div>
            <p className="eyebrow">Vision</p>
            <RichText value={r.box4} />
          </div>
          <div>
            <p className="eyebrow">Mission</p>
            <RichText value={r.box5} />
          </div>
        </div>
      </Section>

      {outcomes.length ? (
        <Section
          eyebrow="Schoolwide learner outcomes"
          title="Head, hands and heart"
        >
          <div className={styles.outcomes}>
            {outcomes.map((o) => (
              <article key={o.term} className={styles.outcome}>
                <h3>{o.term}</h3>
                <p className={styles.outcomeBlurb}>{o.blurb}</p>
                <RichText value={r[o.box]} />
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {symbols.length ? (
        <Section tone="sand" eyebrow="Symbols" title="What we wear and carry">
          {symbols.map((s, i) => (
            <Feature
              key={s.term}
              title={s.term}
              body={r[s.box]}
              image={photos[s.photo - 1]}
              flip={i % 2 === 1}
            />
          ))}
        </Section>
      ) : null}

      <CallToAction
        title="An education built on that"
        body="See how the vision reads in a classroom rather than on a page."
        links={[
          { label: "Our curriculum", href: "/curriculum" },
          { label: "Book a tour", href: "/book_a_tour" },
        ]}
      />
    </>
  );
}
