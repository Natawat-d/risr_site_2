import type { Metadata } from "next";
import { CallToAction, Facts, PageHero, RichText, Section } from "@/components/site/blocks";
import { blocks, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("open_house");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The `open_house` table has fields for a date, a place and a registration
 * switch, all empty except the switch. When the school fills them in this page
 * becomes the event page; until then it explains what an Open House is and
 * sends people to a private tour, which is bookable today.
 */
export default async function Page() {
  const r = await row("open_house");
  const home = await row("home");
  const tour = pick((await row("book_a_tour")).book_link);

  const open = r.registration_open !== false;
  const external = pick(r.external_link);
  const hasDetail = [r.when_text, r.where_text, r.details].some((v) => blocks(v).length);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={pick(r.heading) || copy.title}
        lede={pick(r.intro) || copy.lede}
        image={media(pick(r.banner_image, home.home_pic2, home.home_pic1))}
      >
        {open && external ? (
          <a className="btn btn--accent" href={external} target="_blank" rel="noreferrer">
            Register
          </a>
        ) : null}
      </PageHero>

      <Section>
        {hasDetail ? (
          <Facts
            items={[
              { term: "When", detail: r.when_text },
              { term: "Where", detail: r.where_text },
              { term: "What happens", detail: r.details },
            ]}
          />
        ) : (
          <RichText value={copy.body} />
        )}
        {!open ? (
          <p className="lede" style={{ marginTop: "1.5rem" }}>
            {pick(r.closed_message) ||
              "Registration for the next Open House is not open yet."}
          </p>
        ) : null}
      </Section>

      <CallToAction
        title="Can't wait for the next one?"
        body="A private tour runs on any ordinary school day and takes about an hour."
        links={[
          ...(tour ? [{ label: "Book a tour", href: tour, external: true }] : []),
          { label: "Contact admissions", href: "/contact_us" },
        ]}
      />
    </>
  );
}
