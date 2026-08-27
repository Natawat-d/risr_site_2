import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery, PageHero, RichText, Section } from "@/components/site/blocks";
import { clean, many, gallery, media, pick } from "@/lib/content";
import styles from "../page.module.css";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

async function find(id: string): Promise<Row | null> {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return null;
  return (await many("news", { where: { id: n }, take: 1 }))[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const article = await find((await params).id);
  if (!article) return { title: "News" };
  return {
    title: clean(article.title),
    description: clean(article.summary).slice(0, 200),
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const article = await find((await params).id);
  if (!article) notFound();

  const images = gallery(article, "news_image", 6).filter(
    (src) => src !== media(article.news_image),
  );

  return (
    <>
      <PageHero
        eyebrow={pick(article.category).replace(/_/g, " ").replace(/^All$/i, "News")}
        title={clean(article.title)}
        image={media(pick(article.banner_image, article.news_image))}
      />

      <Section>
        <article className={styles.article}>
          <Link className={styles.back} href="/news">
            <span aria-hidden="true">←</span> All news
          </Link>
          {article.date ? (
            <p className={styles.meta}>{fmt.format(new Date(article.date as string))}</p>
          ) : null}
          {pick(article.summary) ? (
            <p className={styles.summary}>{clean(article.summary)}</p>
          ) : null}
          <RichText value={article.content1} />
          <RichText value={article.content2} />
        </article>
      </Section>

      {images.length ? (
        <Section tone="sand">
          <Gallery images={images} />
        </Section>
      ) : null}
    </>
  );
}
