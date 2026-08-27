import Link from "next/link";
import { delegate, media, paragraphs, pick, row } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * Homepage, in the pattern the customer pointed at: hero with a short tagline
 * and three calls to action, a row of figures, the pillars, a card grid, then
 * recent news.
 *
 * Every word and picture still comes from the `home` and `news` tables the
 * existing admin edits, so this is a second presentation of the same content —
 * not a second copy of it.
 */
type Row = Record<string, unknown>;

/**
 * Fallbacks, used only when the New Site — Homepage editor has been cleared.
 * The migration seeds the table with exactly these values, so in practice the
 * school is editing them rather than meeting them.
 */
const DEFAULT_HERO = {
  heading: "Engaged learning for a changing world",
  lede:
    "A Catholic school offering an interfaith, inclusive and academically " +
    "rigorous education on one campus in Nonthaburi.",
};

export default async function HomePage() {
  const home = await row("home");
  const v2 = await row("site2_home");
  const news = (await delegate("news").findMany({
    orderBy: { date: "desc" },
    take: 3,
  })) as Row[];

  const logos = [1, 2, 3, 4, 5, 6, 7]
    .map((n) => media(home[`home_logo${n}`]))
    .filter(Boolean);

  const pillars = [
    { title: "Care", body: home.home_Care, img: home.home_pic5 },
    { title: "Community", body: home.home_community_why, img: home.home_pic6 },
    { title: "Compassion", body: home.home_compassion, img: home.home_pic7 },
    { title: "Connection", body: home.home_connection, img: home.home_pic8 },
  ].filter((p) => pick(p.body) || media(p.img));

  // The banner photograph is its own field so the school can give the new
  // design a wide shot without disturbing the old site — their first note was
  // that this photo has a head cut off, which is a cropping problem.
  const hero = media(v2.hero_image) || media(home.home_pic3);

  const ctas = [1, 2, 3]
    .map((n) => ({
      label: pick(v2[`cta${n}_label`]),
      href: pick(v2[`cta${n}_link`]),
    }))
    .filter((c) => c.label && c.href);

  const stats = [1, 2, 3, 4]
    .map((n) => ({
      figure: pick(v2[`stat${n}_figure`]),
      label: pick(v2[`stat${n}_label`]),
    }))
    .filter((s) => s.figure);
  const vision = pick(home.home_VISION);
  const mission = pick(home.home_MISSION);

  return (
    <>
      {/* ── hero ──────────────────────────────────────────────────────── */}
      <section className="hero">
        {hero ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="hero__media" src={hero} alt="" fetchPriority="high" />
        ) : null}
        <div className={`wrap hero__inner`}>
          <h1>{pick(v2.hero_heading) || DEFAULT_HERO.heading}</h1>
          <p className="hero__lede">{pick(v2.hero_lede) || DEFAULT_HERO.lede}</p>
          {ctas.length ? (
            <div className="hero__cta">
              {ctas.map((c, i) => (
                <Link
                  key={c.href}
                  className={`btn ${i === 0 ? "btn--accent" : "btn--ghost"}`}
                  href={c.href}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── figures ───────────────────────────────────────────────────── */}
      {stats.length ? (
      <section className="band band--sand">
        <div className="wrap">
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.figure}>
                <p className="stat__figure">{s.figure}</p>
                <p className="stat__label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* ── welcome ───────────────────────────────────────────────────── */}
      {pick(home.home_OUR) ? (
        <section className="band">
          <div className="wrap">
            <p className="eyebrow">Welcome</p>
            <h2>Our school</h2>
            <div className="lede" style={{ marginTop: "1rem" }}>
              {paragraphs(home.home_OUR).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── pillars ───────────────────────────────────────────────────── */}
      {pillars.length ? (
        <section className="band band--sand">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Why RIS Ratchapruek</p>
              <h2>What we teach for</h2>
            </div>
            <div className="pillars">
              {pillars.map((p) => (
                <article className="pillar" key={p.title}>
                  {media(p.img) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="pillar__img" src={media(p.img)} alt="" loading="lazy" />
                  ) : null}
                  <h3>{p.title}</h3>
                  <p>{pick(p.body)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── vision & mission ──────────────────────────────────────────── */}
      {vision || mission ? (
        <section className="band band--navy">
          <div className="wrap split">
            {vision ? (
              <div>
                <p className="eyebrow">Vision</p>
                {paragraphs(vision).map((p, i) => (
                  <p className="lede" key={i}>
                    {p}
                  </p>
                ))}
              </div>
            ) : null}
            {mission ? (
              <div>
                <p className="eyebrow">Mission</p>
                {paragraphs(mission).map((p, i) => (
                  <p className="lede" key={i}>
                    {p}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── accreditations ────────────────────────────────────────────── */}
      {logos.length ? (
        <section className="band">
          <div className="wrap">
            <div className="section-head" style={{ textAlign: "center" }}>
              <p className="eyebrow">Accredited &amp; affiliated</p>
            </div>
            <div className="marks">
              {logos.map((src) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── news ──────────────────────────────────────────────────────── */}
      {news.length ? (
        <section className="band band--sand">
          <div className="wrap">
            <div className="section-head section-head--row">
              <div>
                <p className="eyebrow">Latest</p>
                <h2>News from the campus</h2>
              </div>
              <Link className="btn btn--navy" href="/news">
                All news
              </Link>
            </div>
            <div className="cards">
              {news.map((n) => (
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
                      {n.date
                        ? new Intl.DateTimeFormat("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(n.date as string))
                        : null}
                    </span>
                    <h3>{String(n.title ?? "")}</h3>
                    <p>{String(n.summary ?? "")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
