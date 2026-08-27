import type { Metadata } from "next";
import {
  CallToAction,
  DocList,
  Feature,
  Gallery,
  PageHero,
  RichText,
  Section,
} from "@/components/site/blocks";
import { blocks, clean, docUrl, gallery, many, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("work_at_risr");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The vacancy lists.
 *
 * `leadership_op`, `teaching_op` and `non_teaching_op` are three tables of
 * fifteen rows, each a job description and a link. They have their own admin
 * screens and their own role — "Human resource" in the old CMS exists to edit
 * exactly these — and on the live site **none of the three is rendered
 * anywhere**. HR has an editor whose output no page reads, which is why the
 * school has never noticed all forty-five rows are blank.
 *
 * They are rendered here. Empty rows are skipped, so the section appears the
 * moment HR types into one and disappears again when a post is filled.
 */
const LISTS = [
  { table: "leadership_op", text: "details_leader", link: "details_leader_link", term: "Leadership" },
  { table: "teaching_op", text: "details_teaching", link: "details_teaching_link", term: "Teaching" },
  { table: "non_teaching_op", text: "details_non_teaching", link: "details_non_teaching_link", term: "Non-teaching" },
] as const;

type Vacancy = { term: string; label: string; url: string };

async function vacancies(): Promise<Vacancy[]> {
  const out: Vacancy[] = [];
  for (const l of LISTS) {
    for (const r of await many(l.table, { orderBy: { id: "asc" } })) {
      const label = pick(r[l.text]);
      if (!label) continue;
      out.push({ term: l.term, label: clean(label).split("\n")[0].trim(), url: pick(r[l.link]) });
    }
  }
  return out;
}

export default async function Page() {
  const r = await row("work_risr");
  const open = await vacancies();
  const photos = gallery(r, "work_pic", 3);
  const handbook = docUrl(r.work_pdf_link);

  const groups = LISTS.map((l) => ({
    term: l.term,
    items: open.filter((o) => o.term === l.term),
  })).filter((g) => g.items.length);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.banner_image))}
      />

      {blocks(r.work_box1).length ? (
        <Section eyebrow="Why here">
          <Feature body={r.work_box1} image={photos[0]} />
        </Section>
      ) : null}

      <Section tone="sand" eyebrow="Vacancies" title="Current openings">
        {groups.length ? (
          <div className={styles.groups}>
            {groups.map((g) => (
              <div key={g.term}>
                <h3 className={styles.groupTerm}>{g.term}</h3>
                <ul className={styles.roles}>
                  {g.items.map((v, i) => (
                    <li key={`${g.term}-${i}`}>
                      {v.url ? (
                        <a href={v.url} target="_blank" rel="noreferrer">
                          {v.label} <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span>{v.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="lede">
            There are no advertised vacancies at the moment. Speculative
            applications are welcome — send a CV and a covering letter through
            the contact form and it will reach the right division.
          </p>
        )}
      </Section>

      {blocks(r.work_box2).length ? (
        <Section eyebrow="Package" title="Salary and benefits">
          <div className="split">
            <RichText value={r.work_box2} />
            {photos[1] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="split__img" src={photos[1]} alt="" loading="lazy" />
            ) : null}
          </div>
        </Section>
      ) : null}

      {blocks(r.work_box3).length ? (
        <Section tone="navy" eyebrow="Safeguarding" title="Working with children">
          <RichText value={r.work_box3} />
        </Section>
      ) : null}

      {handbook ? (
        <Section eyebrow="Documents" title="Before you apply">
          <DocList
            docs={[{ label: "Child safeguarding policy", url: handbook }]}
          />
        </Section>
      ) : null}

      {photos.length > 2 ? (
        <Section tone="sand">
          <Gallery images={photos.slice(2)} />
        </Section>
      ) : null}

      <CallToAction
        title="Send us your CV"
        body="Applications and enquiries both go through the contact form."
        links={[
          { label: "Contact us", href: "/contact_us" },
          { label: "About the school", href: "/history" },
        ]}
      />
    </>
  );
}
