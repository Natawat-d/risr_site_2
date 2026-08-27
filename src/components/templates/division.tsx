import {
  CallToAction,
  DocList,
  Embed,
  Feature,
  Gallery,
  PageHero,
  RichText,
  Section,
} from "@/components/site/blocks";
import { blocks, docUrl, embeddable, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

/**
 * The four academic divisions. Same page, four tables, four column prefixes —
 * the legacy schema gave each division its own copy of the same form, down to
 * the misspelling in `midedle`.
 *
 * The text fields are long and the old site printed them one after another
 * through `nl2br`, which made Elementary a 900-word wall. Here the parser
 * restores the headings and lists inside them, so the same words arrive as
 * sections a parent can skim.
 */
export type DivisionSlug =
  | "early_years"
  | "elementary_school"
  | "middle_school"
  | "high_school";

type Config = {
  table: string;
  banner: string;
  photo: string;
  photos: number;
  /** Body fields, in reading order. */
  boxes: string[];
  /** A Google Drive document to show inline. */
  embed?: string;
  /** A second document, offered as a link rather than embedded. */
  link?: string;
};

const CONFIG: Record<DivisionSlug, Config> = {
  early_years: {
    table: "pre_kindergarten",
    banner: "pre_banner",
    photo: "pre_photo",
    photos: 9,
    boxes: ["box1", "box2", "box3"],
    embed: "box4",
    link: "link",
  },
  elementary_school: {
    table: "elementary",
    banner: "ele_banner",
    photo: "ele_photo",
    photos: 7,
    boxes: ["box1", "box2", "box3", "box4"],
    embed: "box5",
    link: "link",
  },
  middle_school: {
    table: "midedle",
    banner: "mid_banner",
    photo: "mid_photo",
    photos: 9,
    boxes: ["box1", "box2", "box3"],
    embed: "box4",
    link: "link",
  },
  high_school: {
    table: "high",
    banner: "high_banner",
    photo: "high_photo",
    photos: 11,
    boxes: ["box1", "box2", "box3", "box4", "box5", "box6", "box7"],
    embed: "box8",
    link: "link",
  },
};

export async function DivisionPage({ slug }: { slug: DivisionSlug }) {
  const copy = copyFor(slug);
  const c = CONFIG[slug];
  const r = await row(c.table);

  const banner = media(pick(r[c.banner]));
  const photos = gallery(r, c.photo, c.photos)
    // The banner is repeated in a photo slot on three of the four divisions;
    // showing it twice on one page looks like a mistake.
    .filter((p) => p !== banner);

  const sections = c.boxes.map((b) => r[b]).filter((v) => blocks(v).length);
  const embed = c.embed ? embeddable(r[c.embed]) : "";
  const link = c.link ? docUrl(r[c.link]) : "";

  // The legacy template's field order is `box1 · photo1 · box2 · link ·
  // photo2..photoN · box3 · box4…`, so the first photograph belongs with the
  // opening paragraph and the rest are a gallery. Pairing one photo per text
  // block instead — which is what a generic template does — leaves the long
  // standards sections next to unrelated pictures, and a screen of white space
  // beside each of them.
  const [opening, ...rest] = sections;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={banner}
      />

      {opening ? (
        <Section>
          <Feature body={opening} image={photos[0]} />
        </Section>
      ) : null}

      {photos.length > 1 ? (
        <Section tone="sand" eyebrow="Around the division" title="Life here">
          <Gallery images={photos.slice(1)} />
        </Section>
      ) : null}

      {rest.length ? (
        <Section eyebrow="The programme" title={`Inside ${copy.title}`}>
          {rest.map((body, i) => (
            <div key={i} className={i ? "stack" : undefined}>
              <RichText value={body} />
            </div>
          ))}
        </Section>
      ) : null}

      {embed || link ? (
        <Section eyebrow="Documents" title="Programme of studies">
          {embed ? <Embed url={embed} title={`${copy.title} programme of studies`} /> : null}
          {link ? (
            <div style={{ marginTop: embed ? "1.25rem" : 0 }}>
              <DocList docs={[{ label: `${copy.title} — open the full document`, url: link }]} />
            </div>
          ) : null}
        </Section>
      ) : null}

      <CallToAction
        title={`See ${copy.title} in person`}
        body="Tours run on ordinary school days, so you see the division at work."
        links={[
          { label: "Book a tour", href: "/book_a_tour" },
          { label: "How to apply", href: "/apply_now" },
        ]}
      />
    </>
  );
}
