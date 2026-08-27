import type { Metadata } from "next";
import {
  CallToAction,
  Figure,
  Gallery,
  PageHero,
  RichText,
  Section,
  Video,
} from "@/components/site/blocks";
import { blocks, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("history");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The twelve boxes on this page are not twelve paragraphs — they alternate
 * narrative and caption, one caption per photograph. The legacy template makes
 * the pairing explicit in its field order:
 *
 *     box1  photo1  box2  |  box3  photo2  box4  |  box5  photo3  box6
 *     box7  photo4  box8  |  box9  photo5  box10 |  box11  photos 6–8  box12
 *
 * and the text confirms it — box2 opens "This photo, dated November 1965…",
 * box6 says "Pictured here is the official opening ceremony". Rendering them as
 * a flat sequence, which is what a generic template does, leaves five captions
 * stranded beside photographs they aren't describing.
 *
 * So: five chapters of narrative-then-captioned-photograph, and the Ratchapruek
 * campus last, which is what boxes 11 and 12 are about.
 *
 * `era` is the one thing on this page we add rather than read — a short label
 * over each chapter, taken from what that chapter's own text says. If the
 * school rewrites a box the label may stop fitting, which is why they are
 * declared here in one list rather than scattered through the markup.
 */
const CHAPTERS = [
  { text: "box1", photo: 1, caption: "box2", era: "1957" },
  { text: "box3", photo: 2, caption: "box4", era: "A union of hearts" },
  { text: "box5", photo: 3, caption: "box6", era: "Academic excellence" },
  { text: "box7", photo: 4, caption: "box8", era: "Head, hands, heart" },
  { text: "box9", photo: 5, caption: "box10", era: "Today" },
] as const;

export default async function Page() {
  const r = await row("history");
  const photos = gallery(r, "his_photo", 8);

  const chapters = CHAPTERS.filter(
    (c) => blocks(r[c.text]).length || photos[c.photo - 1],
  );

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.his_banner))}
      />

      <Section>
        {chapters.map((c, i) => (
          <div className={`split ${i % 2 ? "split--flip" : ""} ${styles.chapter}`} key={c.text}>
            <div>
              <p className="eyebrow">{c.era}</p>
              <RichText value={r[c.text]} />
            </div>
            <Figure src={photos[c.photo - 1]} caption={r[c.caption]} />
          </div>
        ))}
      </Section>

      <Section tone="sand" eyebrow="Watch" title="The school, in three minutes">
        <Video url={r.link_his} title="Ruamrudee International School" />
      </Section>

      {blocks(r.box11).length || blocks(r.box12).length || photos.length > 5 ? (
        <Section tone="navy" eyebrow="2019" title="RIS Ratchapruek">
          <RichText value={r.box11} />
          {photos.length > 5 ? (
            <div className={styles.campus}>
              <Gallery images={photos.slice(5)} />
            </div>
          ) : null}
          <RichText value={r.box12} />
        </Section>
      ) : null}

      <CallToAction
        title="Sixty years on, still admitting"
        body="Come and see the newest of the three campuses."
        links={[
          { label: "Book a tour", href: "/book_a_tour" },
          { label: "How to apply", href: "/apply_now" },
        ]}
      />
    </>
  );
}
