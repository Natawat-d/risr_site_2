import type { Metadata } from "next";
import Link from "next/link";
import { CallToAction, PageHero, RichText, Section } from "@/components/site/blocks";
import { media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("curriculum");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The `curriculum` row has one text field and a banner — the thinnest page on
 * the site, and on the old one it was a paragraph floating in white space.
 *
 * What a parent wants next from it is the division their child would enter, so
 * the page carries them: four cards straight into Early Years, Elementary,
 * Middle and High. Each pulls its own banner, so the cards stay current with
 * whatever those divisions upload.
 */
const DIVISIONS = [
  { href: "/early_years", title: "Early Years", note: "Pre-K 2 – Kindergarten", table: "pre_kindergarten", banner: "pre_banner" },
  { href: "/elementary_school", title: "Elementary School", note: "Kindergarten – Grade 5", table: "elementary", banner: "ele_banner" },
  { href: "/middle_school", title: "Middle School", note: "Grades 6 – 8", table: "midedle", banner: "mid_banner" },
  { href: "/high_school", title: "High School", note: "Grades 9 – 12", table: "high", banner: "high_banner" },
] as const;

export default async function Page() {
  const r = await row("curriculum");
  const cards = await Promise.all(
    DIVISIONS.map(async (d) => ({
      ...d,
      image: media(pick((await row(d.table))[d.banner])),
    })),
  );

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.curriculum_banner))}
      />

      <Section>
        <RichText value={r.box1} />
      </Section>

      <Section tone="sand" eyebrow="By division" title="Where your child would start">
        <div className="cards">
          {cards.map((d) => (
            <Link className="card" key={d.href} href={d.href}>
              {d.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className="card__img" src={d.image} alt="" loading="lazy" />
              ) : null}
              <div className="card__body">
                <span className="card__meta">{d.note}</span>
                <h3>{d.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CallToAction
        title="Questions about placement?"
        body="Admissions can tell you which year group your child would join and what the assessment involves."
        links={[
          { label: "How to apply", href: "/apply_now" },
          { label: "Contact us", href: "/contact_us" },
        ]}
      />
    </>
  );
}
