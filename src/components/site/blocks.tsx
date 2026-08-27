import Link from "next/link";
import { blocks, embeddable, type Block } from "@/lib/content";
import styles from "./blocks.module.css";

/*
 * The shared vocabulary every page is built from.
 *
 * There are 31 pages and five real shapes between them. Rather than 31 hand-
 * built layouts that drift apart, each page picks from these and passes CMS
 * fields in. A change to how a gallery looks is one file, not thirty.
 */

/* ── page hero ──────────────────────────────────────────────────────────── */

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={`${styles.hero} ${image ? styles.heroPhoto : ""}`}>
      {image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className={styles.heroMedia} src={image} alt="" fetchPriority="high" />
      ) : null}
      <div className={`wrap ${styles.heroInner}`}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {/* Stated explicitly. A hero heading that inherits its colour is how the
            original site ended up with navy text on a navy band. */}
        <h1 className={styles.heroTitle}>{title}</h1>
        {lede ? <p className={styles.heroLede}>{lede}</p> : null}
        {children ? <div className={styles.heroCta}>{children}</div> : null}
      </div>
    </header>
  );
}

/* ── rich text ──────────────────────────────────────────────────────────── */

function renderBlock(b: Block, i: number) {
  if (b.kind === "h") return <h3 key={i}>{b.text}</h3>;
  if (b.kind === "ul")
    return (
      <ul key={i}>
        {b.items.map((t, j) => (
          <li key={j}>{t}</li>
        ))}
      </ul>
    );
  return <p key={i}>{b.text}</p>;
}

/** A legacy textarea field, rendered with its headings and bullets restored. */
export function RichText({ value, className }: { value: unknown; className?: string }) {
  const parsed = blocks(value);
  if (!parsed.length) return null;
  return (
    <div className={`${styles.prose} ${className ?? ""}`}>{parsed.map(renderBlock)}</div>
  );
}

/* ── section wrapper ────────────────────────────────────────────────────── */

export function Section({
  eyebrow,
  title,
  tone,
  children,
  id,
}: {
  eyebrow?: string;
  title?: string;
  tone?: "sand" | "navy";
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`band ${tone ? `band--${tone}` : ""}`}>
      <div className="wrap">
        {eyebrow || title ? (
          <div className="section-head">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/* ── alternating text/photo feature ─────────────────────────────────────── */

/**
 * Text and a photograph.
 *
 * Two columns only when the text is short enough to sit beside a picture. The
 * legacy fields vary from two lines to twelve hundred words in the same column
 * of the same table, and a 50/50 split with a 5:4 image gives the long ones a
 * screen-and-a-half of empty column beside them — which is what the first
 * version of these pages did, and it looked broken rather than airy.
 *
 * So: no picture, or a long body, and the text runs as a readable column with
 * the photograph as a wide band beneath it instead.
 */
const SPLIT_LIMIT = 700;

function textLength(body: unknown): number {
  return blocks(body).reduce(
    (n, b) => n + (b.kind === "ul" ? b.items.join(" ").length : b.text.length),
    0,
  );
}

export function Feature({
  eyebrow,
  title,
  body,
  image,
  flip,
}: {
  eyebrow?: string;
  title?: string;
  body: unknown;
  image?: string;
  flip?: boolean;
}) {
  const length = textLength(body);
  if (!length && !image) return null;

  const head = (
    <>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className={styles.featureTitle}>{title}</h2> : null}
    </>
  );

  if (!image || length > SPLIT_LIMIT) {
    return (
      <div className={styles.feature}>
        {head}
        <RichText value={body} />
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={styles.featureBand} src={image} alt="" loading="lazy" />
        ) : null}
      </div>
    );
  }

  return (
    <div className={`split ${flip ? "split--flip" : ""} ${styles.feature}`}>
      <div>
        {head}
        <RichText value={body} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="split__img" src={image} alt="" loading="lazy" />
    </div>
  );
}

/* ── captioned photograph ───────────────────────────────────────────────── */

/**
 * A photograph with the caption that was written for it.
 *
 * Several pages store a caption in the text field *after* the image field —
 * "This photo, dated November 1965, …", "Pictured here is the official opening
 * ceremony". The old layout put those in a tile beside the picture, which is
 * why they read as orphaned paragraphs; here they are a `<figcaption>`, which
 * is what they are.
 */
export function Figure({ src, caption }: { src: string; caption: unknown }) {
  if (!src) return null;
  const text = blocks(caption);
  return (
    <figure className={styles.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" />
      {text.length ? (
        <figcaption>{text.map((b, i) => renderBlock(b, i))}</figcaption>
      ) : null}
    </figure>
  );
}

/* ── gallery ────────────────────────────────────────────────────────────── */

/**
 * A photo grid.
 *
 * The originals are 2–4 MB camera files; the media route negotiates a WebP
 * sibling, and everything below the fold is lazy. Decorative — the CMS stores
 * no alt text for any of them, and inventing one would be worse than none.
 */
export function Gallery({ images, tall }: { images: string[]; tall?: boolean }) {
  if (!images.length) return null;
  return (
    <div className={`${styles.gallery} ${tall ? styles.galleryTall : ""}`}>
      {images.map((src) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img key={src} src={src} alt="" loading="lazy" />
      ))}
    </div>
  );
}

/* ── embedded document ──────────────────────────────────────────────────── */

/**
 * A Google Drive / Docs document, shown inline.
 *
 * `embeddable()` turns a `/view` link into `/preview` first — the raw share
 * link renders a sign-in wall inside an iframe.
 */
export function Embed({ url, title }: { url: unknown; title: string }) {
  const src = embeddable(url);
  if (!src) return null;
  return (
    <div className={styles.embed}>
      <iframe src={src} title={title} loading="lazy" allow="autoplay" />
    </div>
  );
}

/** A YouTube embed from whatever form of link the CMS holds. */
export function Video({ url, title }: { url: unknown; title: string }) {
  const raw = (url ?? "").toString().trim();
  if (!raw) return null;
  const id =
    raw.match(/embed\/([\w-]{6,})/)?.[1] ??
    raw.match(/[?&]v=([\w-]{6,})/)?.[1] ??
    raw.match(/youtu\.be\/([\w-]{6,})/)?.[1];
  if (!id) return null;
  return (
    <div className={styles.embed}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}

/* ── document list ──────────────────────────────────────────────────────── */

export type Doc = { label: string; url: string; note?: string };

export function DocList({ docs }: { docs: Doc[] }) {
  if (!docs.length) return null;
  return (
    <ul className={styles.docs}>
      {docs.map((d) => (
        <li key={d.url + d.label}>
          <a href={d.url} target="_blank" rel="noreferrer">
            <span className={styles.docLabel}>{d.label}</span>
            {d.note ? <span className={styles.docNote}>{d.note}</span> : null}
            <span className={styles.docGo} aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── closing call to action ─────────────────────────────────────────────── */

export function CallToAction({
  title,
  body,
  links,
}: {
  title: string;
  body?: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <section className={`band ${styles.cta}`}>
      <div className={`wrap ${styles.ctaInner}`}>
        <div>
          <h2 className={styles.ctaTitle}>{title}</h2>
          {body ? <p className={styles.ctaBody}>{body}</p> : null}
        </div>
        <div className={styles.ctaLinks}>
          {links.map((l, i) =>
            l.external ? (
              <a
                key={l.href}
                className={`btn ${i === 0 ? "btn--accent" : "btn--ghost"}`}
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                className={`btn ${i === 0 ? "btn--accent" : "btn--ghost"}`}
                href={l.href}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/* ── fact list ──────────────────────────────────────────────────────────── */

export function Facts({ items }: { items: { term: string; detail: unknown }[] }) {
  const real = items.filter((i) => blocks(i.detail).length);
  if (!real.length) return null;
  return (
    <dl className={styles.facts}>
      {real.map((i) => (
        <div key={i.term}>
          <dt>{i.term}</dt>
          <dd>
            <RichText value={i.detail} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
