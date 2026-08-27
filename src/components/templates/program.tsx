import {
  CallToAction,
  DocList,
  Feature,
  Gallery,
  PageHero,
  RichText,
  Section,
} from "@/components/site/blocks";
import { blocks, docUrl, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

/**
 * Eight Student Life / Community pages share one table shape — a banner, a
 * title, up to three long text fields, a link and twelve image slots — because
 * the old CMS gave each of them a copy of the same form. One template, then.
 *
 * `table` is the table this page's content *belongs in*. On the old site four
 * of these are cross-wired: `/counseling_program` renders the `extended` row,
 * and Service Learning and Week Without Walls render each other's. That is
 * reproduced faithfully in risr-site because a port should not invent; here it
 * is not, for the same reason the navigation isn't — a new design that ships a
 * known bug has shipped a bug. The four affected rows hold only placeholder
 * text today, so the visible result is the template copy either way, and the
 * wiring is correct for whatever the school types next.
 */
export type ProgramSlug =
  | "counseling_program"
  | "pop_star_program"
  | "extended_day_programs"
  | "athletics"
  | "house_system"
  | "service_learning"
  | "week_without_walls"
  | "artists_in_residence";

const TABLE: Record<ProgramSlug, string> = {
  counseling_program: "counseling",
  pop_star_program: "pop",
  extended_day_programs: "extended",
  athletics: "athletics",
  house_system: "house_system",
  service_learning: "ser",
  week_without_walls: "weekwall",
  artists_in_residence: "artists",
};

export async function ProgramPage({ slug }: { slug: ProgramSlug }) {
  const copy = copyFor(slug);
  const r = await row(TABLE[slug]);

  const banner = media(pick(r.banner_image));
  const images = gallery(r, "co_image", 12);
  const doc = docUrl(r.link_co);

  // The CMS body, or the template's — never both, so the school never sees
  // our placeholder sitting underneath their own words.
  const hasBody = [r.content1, r.content2, r.content3].some((v) => blocks(v).length);
  const bodies = hasBody ? [r.content1, r.content2, r.content3] : [copy.body];

  const [lead, ...rest] = bodies.filter((v) => blocks(v).length);
  // The first image reads as a portrait beside the opening text; the remainder
  // become a grid further down. With four or fewer, one grid is calmer.
  const [feature, ...grid] = images.length > 4 ? images : ["", ...images];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={pick(r.title) || copy.title}
        lede={copy.lede}
        image={banner}
      />

      {lead ? (
        <Section>
          {feature ? (
            <Feature body={lead} image={feature} />
          ) : (
            <RichText value={lead} />
          )}
        </Section>
      ) : null}

      {grid.filter(Boolean).length ? (
        <Section tone="sand">
          <Gallery images={grid.filter(Boolean)} />
        </Section>
      ) : null}

      {rest.map((body, i) => (
        <Section key={i} tone={i % 2 === 1 ? "sand" : undefined}>
          <RichText value={body} />
        </Section>
      ))}

      {doc ? (
        <Section eyebrow="Documents" title="More about this programme">
          <DocList docs={[{ label: "Open the full document", url: doc }]} />
        </Section>
      ) : null}

      <CallToAction
        title="Come and see it for yourself"
        body="A tour takes about an hour and runs on ordinary school days."
        links={[
          { label: "Book a tour", href: "/book_a_tour" },
          { label: "Contact us", href: "/contact_us" },
        ]}
      />
    </>
  );
}
