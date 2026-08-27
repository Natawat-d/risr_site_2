import type { Metadata } from "next";
import {
  CallToAction,
  Facts,
  PageHero,
  RichText,
  Section,
} from "@/components/site/blocks";
import { blocks, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("apply_now");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * Twelve unlabelled boxes that are really five different things: an
 * introduction, four age tables, a checklist, three document lists, two
 * payment methods and a "what happens next".
 *
 * The old page rendered them into fixed-height absolutely positioned tiles,
 * which is the overlap the school reported — a longer list simply ran over the
 * one beneath it. Nothing here has a fixed height, so any of these can grow.
 */
const AGES = [
  { box: "box2", term: "Early Years" },
  { box: "box3", term: "Elementary" },
  { box: "box4", term: "Middle School" },
  { box: "box5", term: "High School" },
] as const;

const DOCUMENTS = [
  { box: "box7", term: "Non-Thai applicants" },
  { box: "box8", term: "Thai applicants" },
  { box: "box9", term: "If applicable" },
] as const;

export default async function Page() {
  const r = await row("apply_now");
  const ages = AGES.filter((a) => blocks(r[a.box]).length);
  const docs = DOCUMENTS.filter((d) => blocks(r[d.box]).length);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.apply_banner))}
      >
        <a
          className="btn btn--accent"
          href="https://risr.openapply.com/"
          target="_blank"
          rel="noreferrer"
        >
          Start an application
        </a>
      </PageHero>

      <Section>
        <RichText value={r.box1} />
      </Section>

      {ages.length ? (
        <Section tone="sand" eyebrow="Step one" title="Age requirements">
          <div className={styles.ages}>
            {ages.map((a) => (
              <div className={styles.age} key={a.term}>
                <h3>{a.term}</h3>
                <RichText value={r[a.box]} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {blocks(r.box6).length ? (
        <Section eyebrow="Step two" title="What to submit">
          <RichText value={r.box6} />
        </Section>
      ) : null}

      {docs.length ? (
        <Section tone="sand" eyebrow="Step three" title="Documents">
          <div className={styles.ages}>
            {docs.map((d) => (
              <div className={styles.age} key={d.term}>
                <h3>{d.term}</h3>
                <RichText value={r[d.box]} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section eyebrow="Step four" title="Paying the application fee">
        <Facts
          items={[
            { term: "Bank transfer", detail: r.box10 },
            { term: "Credit card", detail: r.box11 },
          ]}
        />
      </Section>

      {blocks(r.box12).length ? (
        <Section tone="navy" eyebrow="Step five" title="What happens next">
          <RichText value={r.box12} />
        </Section>
      ) : null}

      <CallToAction
        title="Ready when you are"
        body="Applications are made through OpenApply. Admissions will pick it up from there."
        links={[
          { label: "Apply on OpenApply", href: "https://risr.openapply.com/", external: true },
          { label: "Tuition & fees", href: "/tuition_fees" },
        ]}
      />
    </>
  );
}
