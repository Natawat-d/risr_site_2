import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/site/blocks";
import { clean, count, many, media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("news");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

const PER_PAGE = 12;

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Row = Record<string, unknown>;

/**
 * The one real collection in the schema: 33 articles, newest first, paged.
 *
 * `category` is free text and holds three distinct values across the whole
 * table — "All", "High_School" and an empty string — so it is shown as a label
 * where it says something and dropped where it does not, rather than made into
 * a filter that would offer two useful choices.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);

  const banner = await row("new_banner");
  const total = await count("news");
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const items = await many("news", {
    orderBy: [{ date: "desc" }, { id: "desc" }],
    skip: (Math.min(current, pages) - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(banner.news_banner))}
      />

      <Section>
        <div className="cards">
          {items.map((n) => {
            const category = pick(n.category).replace(/_/g, " ");
            return (
              <Link className="card" key={String(n.id)} href={`/news/${n.id}`}>
                {media(n.news_image) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    className="card__img"
                    src={media(n.news_image)}
                    alt=""
                    loading="lazy"
                  />
                ) : null}
                <div className="card__body">
                  <span className="card__meta">
                    {n.date ? fmt.format(new Date(n.date as string)) : null}
                    {category && category.toLowerCase() !== "all"
                      ? ` · ${category}`
                      : null}
                  </span>
                  <h3>{clean(n.title)}</h3>
                  <p>{clean(n.summary).slice(0, 160)}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {pages > 1 ? (
          <nav className={styles.pager} aria-label="News pages">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? "/news" : `/news?page=${p}`}
                aria-current={p === current ? "page" : undefined}
                className={p === current ? styles.pagerOn : undefined}
              >
                {p}
              </Link>
            ))}
          </nav>
        ) : null}
      </Section>
    </>
  );
}
