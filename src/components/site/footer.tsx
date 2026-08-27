import Link from "next/link";
import { row } from "@/lib/content";
import styles from "./footer.module.css";

/**
 * Footer.
 *
 * The original site's footer navigates with
 * `onclick="window.location.href='/history/ '"` — 22 buttons a page, every one
 * of them dead for the whole port because the base-path rewrite does not look
 * inside a JavaScript string, and ten of them carrying a trailing space that
 * 404s even at the root domain. These are anchors.
 */
const COLUMNS = [
  {
    title: "Admissions",
    links: [
      { label: "How to Apply", href: "/apply_now" },
      { label: "Tuition & Fees", href: "/tuition_fees" },
      { label: "Open House", href: "/open_house" },
      { label: "Book a Tour", href: "/book_a_tour" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "History", href: "/history" },
      { label: "Vision & Mission", href: "/vision" },
      { label: "Accreditations", href: "/accreditations" },
      { label: "Leadership", href: "/leadership" },
    ],
  },
  {
    title: "Academics",
    links: [
      { label: "Early Years", href: "/early_years" },
      { label: "Elementary School", href: "/elementary_school" },
      { label: "Middle School", href: "/middle_school" },
      { label: "High School", href: "/high_school" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "News", href: "/news" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "School Calendar", href: "/school_calendar" },
      { label: "Work at RISR", href: "/work_at_risr" },
    ],
  },
];

const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/RISRatchapruek" },
  { label: "Instagram", href: "https://www.instagram.com/risratchapruek" },
  { label: "YouTube", href: "https://www.youtube.com/@risratchapruek" },
];

export async function SiteFooter() {
  // Policy documents are addresses kept in the CMS `links` table, in a fixed
  // order the admin form does not label: box1 AQI, box2 PDPA, box3 safeguarding.
  const links = await row("links");
  const policies = [
    { label: "AQI Policy", slug: "aqi", set: !!links.box1 },
    { label: "Personal Data Protection", slug: "data-protection", set: !!links.box2 },
    { label: "Child Safeguarding", slug: "child-safeguarding", set: !!links.box3 },
  ].filter((p) => p.set);

  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <div className={styles.about}>
            <p className={styles.name}>
              Ruamrudee International School
              <span>Ratchapruek Campus</span>
            </p>
            <address className={styles.address}>
              Bang Kruai – Sai Noi Rd, Tambon Bang Krang,
              <br />
              Amphoe Mueang Nonthaburi, Chang Wat Nonthaburi 11000
              <br />
              <a href="tel:+6620300533">+66 (0)2 030 0533</a>
            </address>
            <ul className={styles.social}>
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h4>{c.title}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Ruamrudee International School Ratchapruek</p>
          {policies.length ? (
            <ul>
              {policies.map((p) => (
                <li key={p.slug}>
                  <Link href={`/policy/${p.slug}`}>{p.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
