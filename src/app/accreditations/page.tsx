import type { Metadata } from "next";
import { CallToAction, PageHero, RichText, Section } from "@/components/site/blocks";
import { blocks, gallery, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("accreditations");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The `accreditations` table has eight logo/name/detail/link slots and every
 * one of them is empty — the row exists but has never been filled in. The seven
 * logos the school actually publishes live in the `home` row instead, which is
 * where the homepage strip reads them from.
 *
 * So: the named entries when the school fills them in, the home logos until
 * then, and the template explanation of what accreditation means either way.
 */
export default async function Page() {
  const r = await row("accreditations");
  const home = await row("home");

  const named = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({
      logo: media(pick(r[`logo${n}`])),
      name: pick(r[`name${n}`]),
      detail: r[`detail${n}`],
      link: pick(r[`link${n}`]),
    }))
    .filter((a) => a.name || a.logo);

  const fallbackLogos = named.length ? [] : gallery(home, "home_logo", 7);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={pick(r.heading) || copy.title}
        lede={pick(r.intro) || copy.lede}
        image={media(pick(r.banner_image, home.home_pic1))}
      />

      <Section>
        <RichText value={blocks(r.intro).length ? r.intro : copy.body} />
      </Section>

      {named.length ? (
        <Section tone="sand" eyebrow="Accredited by" title="Who has assessed us">
          <div className={styles.grid}>
            {named.map((a) => (
              <article key={a.name || a.logo} className={styles.item}>
                {a.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={a.logo} alt={a.name} loading="lazy" />
                ) : null}
                {a.name ? <h3>{a.name}</h3> : null}
                <RichText value={a.detail} />
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noreferrer">
                    Visit ↗
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </Section>
      ) : fallbackLogos.length ? (
        <Section tone="sand" eyebrow="Accredited & affiliated">
          <div className="marks">
            {fallbackLogos.map((src) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        </Section>
      ) : null}

      <CallToAction
        title="See the standards in practice"
        body="The curriculum pages set out what is taught in each division."
        links={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Book a tour", href: "/book_a_tour" },
        ]}
      />
    </>
  );
}
