import type { Metadata } from "next";
import {
  CallToAction,
  Facts,
  Feature,
  Gallery,
  PageHero,
  RichText,
  Section,
} from "@/components/site/blocks";
import { blocks, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("summer");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * Summer School is the one section with a proper set of named columns rather
 * than `box1..box12`, because it was added later.
 *
 * `summer_status` is the school's own switch for whether the programme is
 * running. It is off today, and the page says so rather than advertising last
 * year's dates as if they were open — the row still describes the 2025/26
 * programme, and a parent reading it in August would book against dates that
 * have passed.
 */
export default async function Page() {
  const r = await row("summer_school");
  const running = r.summer_status === true;

  const early = gallery(r, "pre_photo", 9);
  const older = gallery(r, "high_photo", 9);
  const register = pick(r.link_register1, r.link_register2);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.high_banner))}
      >
        {running && register ? (
          <a className="btn btn--accent" href={register} target="_blank" rel="noreferrer">
            Register
          </a>
        ) : null}
      </PageHero>

      {!running ? (
        <Section>
          <p className="lede">
            Registration is closed at the moment. What follows describes the most
            recent programme; dates and fees for the next one are published here
            once they are confirmed.
          </p>
        </Section>
      ) : null}

      {blocks(r.program_description).length ? (
        <Section eyebrow="The programme" title="Three weeks, one theme">
          <RichText value={r.program_description} />
          <RichText value={r.new_students} />
        </Section>
      ) : null}

      {blocks(r.early_years).length ? (
        <Section tone="sand">
          <Feature eyebrow="Early Years" body={r.early_years} image={early[0]} />
          {early.length > 1 ? <Gallery images={early.slice(1, 5)} /> : null}
        </Section>
      ) : null}

      {blocks(r.elementary_school).length ? (
        <Section>
          <Feature eyebrow="Elementary" body={r.elementary_school} image={older[0]} flip />
        </Section>
      ) : null}

      {blocks(r.secondary_school).length ? (
        <Section tone="sand">
          <Feature eyebrow="Secondary" body={r.secondary_school} image={older[1]} />
          {older.length > 2 ? <Gallery images={older.slice(2, 6)} /> : null}
        </Section>
      ) : null}

      <Section eyebrow="Practicalities" title="Dates, fees and who can come">
        <Facts
          items={[
            { term: "When", detail: r.how_to_apply },
            { term: "Who can apply", detail: r.who_can_apply },
            { term: "Fees", detail: r.tuition_fees },
            { term: "More information", detail: r.more_information },
          ]}
        />
      </Section>

      <CallToAction
        title={running ? "Places are open" : "Ask to be told when it opens"}
        body="The admissions office keeps a list and writes when registration opens."
        links={[
          ...(running && register
            ? [{ label: "Register", href: register, external: true }]
            : []),
          { label: "Contact us", href: "/contact_us" },
        ]}
      />
    </>
  );
}
