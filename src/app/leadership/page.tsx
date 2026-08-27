import type { Metadata } from "next";
import { CallToAction, PageHero, RichText, Section } from "@/components/site/blocks";
import { media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

const copy = copyFor("leadership");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * `/leadership` has no table on the old site and no admin section, so it has
 * never had content — the page is a heading and nothing else, and has been
 * since the port.
 *
 * This renders the template description instead. Naming the post-holders needs
 * a table with a photo, a name and a title per person, plus an editor for it;
 * that is a small piece of work in risr-site's admin rather than something to
 * guess at here, and it is listed in the report as an open item.
 */
export default async function Page() {
  const home = await row("home");

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(home.home_pic9, home.home_pic4))}
      />

      <Section>
        <RichText value={copy.body} />
      </Section>

      <CallToAction
        title="Looking for someone in particular?"
        body="The school office will put you through to the right division."
        links={[
          { label: "Contact us", href: "/contact_us" },
          { label: "Work at RISR", href: "/work_at_risr" },
        ]}
      />
    </>
  );
}
