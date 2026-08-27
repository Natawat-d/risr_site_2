import type { Metadata } from "next";
import { CallToAction, PageHero, RichText, Section } from "@/components/site/blocks";
import { media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("staff");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The `portals` row is two links with a switch each. `dis_box2` is off today,
 * so only OpenApply shows — which is the school's own decision and is
 * respected rather than overridden.
 *
 * This is the page the customer described as wrong: a "Portal" menu item that
 * goes straight to a third-party apply page. The Staff Portal he wants — split
 * by community, gated by Google group, with a space per department, and the
 * front door to booking, HR and tickets — is a separate application and is not
 * built. This page is the two links that exist, honestly labelled.
 */
const PORTALS = [
  {
    box: "box1",
    flag: "dis_box1",
    title: "OpenApply",
    note: "Applicants and current families",
    detail: "Applications, documents, payments and admissions correspondence.",
  },
  {
    box: "box2",
    flag: "dis_box2",
    title: "Community portal",
    note: "Current families, students and staff",
    detail: "Day-to-day links, forms, calendars and school notices.",
  },
] as const;

export default async function Page() {
  const r = await row("portals");
  const home = await row("home");
  const open = PORTALS.filter((p) => pick(r[p.box]) && r[p.flag] === true);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(home.home_pic6, home.home_pic1))}
      />

      <Section>
        <RichText value={copy.body} />
      </Section>

      {open.length ? (
        <Section tone="sand" eyebrow="Sign in">
          <div className={styles.portals}>
            {open.map((p) => (
              <a
                key={p.title}
                className={styles.portal}
                href={pick(r[p.box])}
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.portalNote}>{p.note}</span>
                <h3>{p.title}</h3>
                <p>{p.detail}</p>
                <span className={styles.portalGo} aria-hidden="true">
                  Open ↗
                </span>
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      <CallToAction
        title="Can't get in?"
        body="The school office can reset access or point you at the right portal."
        links={[
          { label: "Contact us", href: "/contact_us" },
          { label: "How to apply", href: "/apply_now" },
        ]}
      />
    </>
  );
}
