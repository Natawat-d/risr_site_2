import Link from "next/link";
import { media, row } from "@/lib/content";
import styles from "./nav.module.css";

/**
 * Top navigation: a utility strip, then the main bar with mega-menus.
 *
 * The original site's navbar is ported PHP markup with the dropdown items
 * gated on `status` flags that are rotated against the pages they belong to —
 * `ser` gates Service Learning, `artists` gates Week Without Walls, `weekwall`
 * gates Artists in Residence. That is faithfully wrong, and copying it into a
 * new design would be copying a bug. Here the menu is a plain declaration.
 */
type Item = { label: string; href: string; blurb?: string };
type Group = { label: string; href?: string; intro?: string; items: Item[] };

const MENU: Group[] = [
  {
    label: "About",
    intro: "A Catholic school offering an interfaith, inclusive education since 1957.",
    items: [
      { label: "History", href: "/history", blurb: "Over 60 years in Bangkok" },
      { label: "Vision & Mission", href: "/vision", blurb: "What we teach for" },
      { label: "Accreditations & Members", href: "/accreditations" },
      { label: "Leadership Team", href: "/leadership" },
      { label: "Schoolwide Learner Outcomes", href: "/schoolwide" },
    ],
  },
  {
    label: "Academics",
    intro: "One continuous programme from Early Years to Grade 12.",
    items: [
      { label: "Curriculum", href: "/curriculum" },
      { label: "Early Years", href: "/early_years", blurb: "Pre-K to Kindergarten" },
      { label: "Elementary School", href: "/elementary_school", blurb: "Grades 1–5" },
      { label: "Middle School", href: "/middle_school", blurb: "Grades 6–8" },
      { label: "High School", href: "/high_school", blurb: "Grades 9–12" },
      { label: "Summer School", href: "/summer" },
    ],
  },
  {
    label: "Admissions",
    intro: "Visit the campus, meet the teachers, and see a school day in progress.",
    items: [
      { label: "How to Apply", href: "/apply_now" },
      { label: "Tuition & Fees", href: "/tuition_fees" },
      { label: "Open House", href: "/open_house" },
      { label: "Book a Tour", href: "/book_a_tour" },
    ],
  },
  {
    label: "Student Life",
    intro: "What happens between and around the lessons.",
    items: [
      { label: "Counseling Program", href: "/counseling_program" },
      { label: "POP Star Program", href: "/pop_star_program" },
      { label: "Extended Day Programs", href: "/extended_day_programs" },
      { label: "Athletics", href: "/athletics" },
      { label: "House System", href: "/house_system" },
    ],
  },
  {
    label: "Community",
    intro: "Beyond the classroom, and beyond the campus.",
    items: [
      { label: "Service Learning", href: "/service_learning" },
      { label: "Week Without Walls", href: "/week_without_walls" },
      { label: "Artists in Residence", href: "/artists_in_residence" },
      { label: "News", href: "/news" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
];

const UTILITY: Item[] = [
  { label: "School Calendar", href: "/school_calendar" },
  { label: "Work at RISR", href: "/work_at_risr" },
  { label: "Contact", href: "/contact_us" },
];

export async function SiteNav() {
  const brand = await row("branding");
  const logo = media(brand.logo);

  return (
    <header className={styles.header}>
      <div className={styles.utility}>
        <div className={`wrap ${styles.utilityInner}`}>
          {UTILITY.map((u) => (
            <Link key={u.href} href={u.href}>
              {u.label}
            </Link>
          ))}
          <a href="https://risr.openapply.com/" target="_blank" rel="noreferrer">
            OpenApply
          </a>
        </div>
      </div>

      <nav className={styles.bar} aria-label="Main">
        <div className={`wrap ${styles.barInner}`}>
          <Link href="/" className={styles.brand} aria-label="RIS Ratchapruek — home">
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logo} alt="Ruamrudee International School Ratchapruek" />
            ) : (
              <span className={styles.brandText}>RIS Ratchapruek</span>
            )}
          </Link>

          <input
            type="checkbox"
            id="navToggle"
            className={styles.toggleInput}
            aria-hidden="true"
          />
          <label htmlFor="navToggle" className={styles.toggle}>
            <span className="visually-hidden">Menu</span>
            <span aria-hidden="true" />
          </label>

          <ul className={styles.menu}>
            {MENU.map((g) => (
              <li key={g.label} className={styles.group}>
                <button type="button" className={styles.groupLabel}>
                  {g.label}
                </button>
                <div className={styles.mega}>
                  <div className={`wrap ${styles.megaInner}`}>
                    <div className={styles.megaIntro}>
                      <p className="eyebrow">{g.label}</p>
                      <p>{g.intro}</p>
                    </div>
                    <ul className={styles.megaList}>
                      {g.items.map((i) => (
                        <li key={i.href}>
                          <Link href={i.href}>
                            <span>{i.label}</span>
                            {i.blurb ? <em>{i.blurb}</em> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
            <li className={styles.navCta}>
              <Link href="/book_a_tour" className="btn btn--accent">
                Book a Tour
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
