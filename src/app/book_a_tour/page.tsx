import type { Metadata } from "next";
import { CallToAction, Gallery, PageHero, RichText, Section } from "@/components/site/blocks";
import { gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("book_a_tour");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * `book_a_tour` holds one column: the OpenApply booking link. Everything else
 * on this page is template copy the school can replace, and the photographs are
 * borrowed from the homepage row so the page is not a button on white.
 */
export default async function Page() {
  const r = await row("book_a_tour");
  const home = await row("home");
  const link = pick(r.book_link);
  const photos = gallery(home, "home_pic", 9).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(home.home_pic4, home.home_pic1))}
      >
        {link ? (
          <a className="btn btn--accent" href={link} target="_blank" rel="noreferrer">
            Choose a date
          </a>
        ) : null}
      </PageHero>

      <Section>
        <RichText value={copy.body} />
      </Section>

      {photos.length ? (
        <Section tone="sand">
          <Gallery images={photos} />
        </Section>
      ) : null}

      <CallToAction
        title="Prefer to come to an Open House?"
        body="Open House days are busier, but you see the whole school at once."
        links={[
          ...(link ? [{ label: "Book a private tour", href: link, external: true }] : []),
          { label: "Open House", href: "/open_house" },
        ]}
      />
    </>
  );
}
