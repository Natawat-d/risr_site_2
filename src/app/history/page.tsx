import type { Metadata } from "next";
import {
  CallToAction,
  Feature,
  PageHero,
  RichText,
  Section,
  Video,
} from "@/components/site/blocks";
import { blocks, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("history");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * Twelve numbered text boxes and eight photographs, which the old page laid out
 * as a fixed grid of captioned tiles. Read in order they are a chronology, so
 * that is what this is: an opening, the school's own film, then the story
 * alternating with the archive pictures, and the Ratchapruek campus last
 * because boxes 11 and 12 are specifically about this campus.
 */
export default async function Page() {
  const r = await row("history");
  const photos = gallery(r, "his_photo", 8);

  const opening = r.box1;
  const story = ["box2", "box3", "box4", "box5", "box6", "box7", "box8", "box9", "box10"]
    .map((k) => r[k])
    .filter((v) => blocks(v).length);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.his_banner))}
      />

      {blocks(opening).length ? (
        <Section>
          <Feature eyebrow="1957" body={opening} image={photos[0]} />
        </Section>
      ) : null}

      <Section tone="sand" eyebrow="Watch" title="The school, in three minutes">
        <Video url={r.link_his} title="Ruamrudee International School" />
      </Section>

      <Section eyebrow="Since then" title="Six decades, three campuses">
        {story.map((body, i) => (
          <Feature key={i} body={body} image={photos[i + 1]} flip={i % 2 === 1} />
        ))}
      </Section>

      {blocks(r.box11).length || blocks(r.box12).length ? (
        <Section tone="navy" eyebrow="2019" title="RIS Ratchapruek">
          <RichText value={r.box11} />
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
