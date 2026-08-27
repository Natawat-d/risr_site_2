import type { Metadata } from "next";
import { CallToAction, PageHero, RichText, Section } from "@/components/site/blocks";
import { blocks, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "../vision/page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("schoolwide");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * On the old site `/schoolwide` reads no table at all — the content it is about
 * lives in `home.home_SCHOOLWIDE` with its own diagram in
 * `home.home_imgSCHOOLWIDE`, and the page that should show it shows a heading.
 *
 * So this page reads those two fields, and the three learner-outcome lists from
 * the `vision` row that go with them. Same admin sections the school already
 * uses; nothing new to maintain.
 */
const OUTCOMES = [
  { box: "box6", term: "Head", blurb: "How our students think" },
  { box: "box7", term: "Hands", blurb: "How our students work" },
  { box: "box8", term: "Heart", blurb: "How our students treat others" },
] as const;

export default async function Page() {
  const home = await row("home");
  const vision = await row("vision");
  const diagram = media(pick(home.home_imgSCHOOLWIDE));
  const outcomes = OUTCOMES.filter((o) => blocks(vision[o.box]).length);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(home.home_pic5, home.home_pic1))}
      />

      <Section eyebrow="Principles of Phoenix">
        <div className="split">
          <RichText value={home.home_SCHOOLWIDE} />
          {diagram ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={diagram}
              alt="The Principles of Phoenix"
              loading="lazy"
              style={{ width: "100%", borderRadius: "var(--radius)" }}
            />
          ) : null}
        </div>
      </Section>

      {outcomes.length ? (
        <Section tone="sand" eyebrow="Learner outcomes" title="What a graduate looks like">
          <div className={styles.outcomes}>
            {outcomes.map((o) => (
              <article key={o.term} className={styles.outcome}>
                <h3>{o.term}</h3>
                <p className={styles.outcomeBlurb}>{o.blurb}</p>
                <RichText value={vision[o.box]} />
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <CallToAction
        title="How this shows up day to day"
        body="The POP Star programme is how the school notices these being lived out."
        links={[
          { label: "POP Star Program", href: "/pop_star_program" },
          { label: "Vision & mission", href: "/vision" },
        ]}
      />
    </>
  );
}
