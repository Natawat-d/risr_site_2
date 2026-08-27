/**
 * Page templates — the school's own words, ready to be edited.
 *
 * The customer asked us to "conclude the content of the previous web as a
 * template, make admin can change later". This file is that template: a title,
 * a standfirst and, where the database has nothing usable, a body written from
 * the school's existing material.
 *
 * **Nothing here overrides the CMS.** Every page reads its legacy table first
 * and only falls back to this when the field is empty or holds one of the
 * `[value-N]` placeholders. So the school edits a page exactly where it already
 * edits it — Admin → the matching section at /risr/admin — and the template
 * quietly stops being used the moment they save real copy.
 *
 * `admin` on each entry records where that page's real content is edited, so
 * whoever picks this up next does not have to guess.
 */

export type PageCopy = {
  /** Small label above the title. */
  eyebrow: string;
  /** The `<h1>` — used when the CMS title is empty. */
  title: string;
  /** One-sentence standfirst under the title. */
  lede: string;
  /** Body copy, used only when the CMS body fields are empty. */
  body?: string;
  /** Where the school edits this page's real content. */
  admin: string;
};

export const PAGE_COPY: Record<string, PageCopy> = {
  /* ── About ───────────────────────────────────────────────────────────── */

  history: {
    eyebrow: "About",
    title: "Our history",
    lede: "From a single school in downtown Bangkok in 1957 to three campuses across the city.",
    admin: "Admin → History",
  },
  vision: {
    eyebrow: "About",
    title: "Vision & mission",
    lede: "What the school is for, and the symbols that carry it.",
    admin: "Admin → Vision",
  },
  accreditations: {
    eyebrow: "About",
    title: "Accreditations & memberships",
    lede:
      "RIS Ratchapruek is accredited and its programmes are authorised by bodies " +
      "that assess international schools against published standards.",
    body:
      "Accreditation means an outside body has examined how the school teaches, " +
      "how it looks after students and how it governs itself, and re-examines it " +
      "on a fixed cycle.\n\n" +
      "For a family it is the practical answer to two questions: whether a " +
      "transcript from this school will be recognised by the next one, and " +
      "whether anyone independent has checked what happens here.",
    admin: "Admin → Accreditations, and the logo row in Admin → Home",
  },
  leadership: {
    eyebrow: "About",
    title: "Leadership team",
    lede: "The people responsible for the school's academic programme and daily life.",
    body:
      "RIS Ratchapruek is led by the Head of School, working with the Principal " +
      "and Director of Academics, the Assistant Head of School, and the divisional " +
      "leaders for Early Years, Elementary, Middle and High School.\n\n" +
      "Alongside them sit the heads of admissions, student support, activities and " +
      "operations. Between them they carry the curriculum, safeguarding, and the " +
      "day-to-day running of the campus.\n\n" +
      "To reach a member of the leadership team, contact the school office and ask " +
      "for the division concerned.",
    admin: "Not yet an admin section — this page has no table on the old site either",
  },
  schoolwide: {
    eyebrow: "About",
    title: "Schoolwide learner outcomes",
    lede: "What every RIS Ratchapruek student should be able to do by the time they leave.",
    admin: "Admin → Home (the Schoolwide field and its image)",
  },

  /* ── Academics ───────────────────────────────────────────────────────── */

  curriculum: {
    eyebrow: "Academics",
    title: "Curriculum",
    lede: "A standards-based American curriculum, from Pre-K through Grade 12.",
    admin: "Admin → Curriculum",
  },
  early_years: {
    eyebrow: "Academics",
    title: "Early Years",
    lede: "Pre-K 2 to Kindergarten, in a pod of their own.",
    admin: "Admin → Pre-Kindergarten",
  },
  elementary_school: {
    eyebrow: "Academics",
    title: "Elementary School",
    lede: "Kindergarten to Grade 5.",
    admin: "Admin → Elementary",
  },
  middle_school: {
    eyebrow: "Academics",
    title: "Middle School",
    lede: "Grades 6 to 8.",
    admin: "Admin → Middle School",
  },
  high_school: {
    eyebrow: "Academics",
    title: "High School",
    lede: "Grades 9 to 12, and the diploma that follows.",
    admin: "Admin → High School",
  },
  summer: {
    eyebrow: "Academics",
    title: "Summer School",
    lede: "Three weeks in June and July, open to RISR and non-RISR students.",
    body:
      "Summer School returns each June. Details of the next programme — theme, " +
      "dates, fees and how to register — are published here once they are set.\n\n" +
      "In the meantime the admissions office can answer questions about age " +
      "ranges, hours and what a day looks like.",
    admin: "Admin → Summer School (including the switch that shows or hides it)",
  },

  /* ── Admissions ──────────────────────────────────────────────────────── */

  apply_now: {
    eyebrow: "Admissions",
    title: "How to apply",
    lede: "What to send, what it costs, and what happens after you do.",
    admin: "Admin → Apply Now",
  },
  tuition_fees: {
    eyebrow: "Admissions",
    title: "Tuition & fees",
    lede: "The current fee schedule, in full.",
    admin: "Admin → Tuition & Fees",
  },
  open_house: {
    eyebrow: "Admissions",
    title: "Open House",
    lede: "Spend a morning on campus while school is in session.",
    body:
      "An Open House is the school on an ordinary day: classrooms in use, " +
      "teachers to talk to, and the chance to walk the campus rather than read " +
      "about it.\n\n" +
      "The next date is announced here and on the school's Facebook page. " +
      "Registration opens a few weeks beforehand.",
    admin: "Admin → Open House",
  },
  book_a_tour: {
    eyebrow: "Admissions",
    title: "Book a tour",
    lede: "A private visit, arranged around your schedule.",
    body:
      "A tour takes about an hour. You will see the year groups your children " +
      "would join, meet the admissions team, and have time to ask the questions " +
      "that an open day is too busy for.\n\n" +
      "Tours run on school days during term time. Choose a slot through the " +
      "booking page below and the admissions office will confirm by email.",
    admin: "Admin → Book a Tour (the booking link)",
  },

  /* ── Student Life ────────────────────────────────────────────────────── */

  counseling_program: {
    eyebrow: "Student Life",
    title: "Counseling",
    lede: "Academic, university and personal guidance, at every stage.",
    body:
      "The counselling team supports students across three areas: how they are " +
      "getting on academically, what comes after school, and how they are doing " +
      "in themselves.\n\n" +
      "In the younger divisions that mostly means settling in, friendships and " +
      "learning support, worked out with the classroom teacher. In High School it " +
      "adds course selection, university applications, references and deadlines.\n\n" +
      "Counsellors are also the first point of contact for a family that is " +
      "worried about something. Conversations are confidential within the limits " +
      "of the school's safeguarding policy.",
    admin: "Admin → Counseling",
  },
  pop_star_program: {
    eyebrow: "Student Life",
    title: "POP Star Program",
    lede: "Recognising the Principles of Phoenix in everyday behaviour.",
    body:
      "The Principles of Phoenix describe growth in head, hands and heart. The " +
      "POP Star Program is how the school notices them being lived out — not in " +
      "an assembly performance, but in the ordinary moments of a school day.\n\n" +
      "Staff nominate students they have seen show one of the principles. " +
      "Nominations are read out and collected through the year, and count " +
      "towards each student's house.",
    admin: "Admin → POP",
  },
  extended_day_programs: {
    eyebrow: "Student Life",
    title: "Extended Day Program",
    lede: "Activity-based courses after the school day, open to all students.",
    admin: "Admin → Extended",
  },
  athletics: {
    eyebrow: "Student Life",
    title: "Athletics",
    lede: "Training, teams and fixtures across the school year.",
    body:
      "Sport at RIS Ratchapruek runs on two tracks. Physical education is part of " +
      "the timetable for every student; the athletics programme adds training and " +
      "competition for those who want it.\n\n" +
      "Squads are drawn from Elementary through High School and play in local " +
      "international-school fixtures, with a season structure that lets students " +
      "take up more than one sport across the year.\n\n" +
      "The campus has a covered multi-purpose court, a field and a swimming pool. " +
      "Fixtures and training times are published each season.",
    admin: "Admin → Athletics",
  },
  house_system: {
    eyebrow: "Student Life",
    title: "House system",
    lede: "Four houses, every year group, points across the whole year.",
    admin: "Admin → House System",
  },

  /* ── Community ───────────────────────────────────────────────────────── */

  service_learning: {
    eyebrow: "Community",
    title: "Service learning",
    lede: "Compassion through action, taught as part of the curriculum.",
    body:
      "Service learning is the school's mission put into practice: students " +
      "identify a real need, plan a response, carry it out, and reflect on what " +
      "changed.\n\n" +
      "Projects are tied to the United Nations Sustainable Development Goals and " +
      "run with partner organisations in Nonthaburi and across Bangkok, so the " +
      "work is genuinely useful to somebody rather than an exercise.\n\n" +
      "Every division takes part, at the scale that suits it — a class project in " +
      "Elementary, a student-led campaign in High School.",
    admin: "Admin → Service Learning",
  },
  week_without_walls: {
    eyebrow: "Community",
    title: "Week Without Walls",
    lede: "One week a year when the timetable stops and the learning moves.",
    body:
      "Week Without Walls takes each year group out of the classroom for a week " +
      "of field-based learning — in the city, elsewhere in Thailand, or abroad " +
      "for the oldest students.\n\n" +
      "Each trip is built around something the year group has been studying, and " +
      "includes a service component. Students travel with their teachers, and the " +
      "week counts as school time.\n\n" +
      "Destinations, costs and consent forms are sent to families in advance.",
    admin: "Admin → Week Without Walls",
  },
  artists_in_residence: {
    eyebrow: "Community",
    title: "Artists in Residence",
    lede: "Working artists on campus, teaching alongside our own staff.",
    body:
      "The Artists in Residence programme brings practising musicians, dancers, " +
      "designers and visual artists onto campus to work with students for a " +
      "sustained period rather than a single workshop.\n\n" +
      "Residencies are built into the arts curriculum and usually finish with " +
      "something public — a performance, an exhibition, or a piece that stays on " +
      "campus.",
    admin: "Admin → Artists",
  },
  news: {
    eyebrow: "Community",
    title: "News",
    lede: "What has been happening on campus.",
    admin: "Admin → News",
  },
  newsletter: {
    eyebrow: "Community",
    title: "Newsletter",
    lede: "The school newsletter, issue by issue.",
    admin: "Admin → Newsletter",
  },

  /* ── Utility ─────────────────────────────────────────────────────────── */

  school_calendar: {
    eyebrow: "Community",
    title: "School calendar",
    lede: "Term dates, holidays and the events calendar.",
    admin: "Admin → School Calendar",
  },
  work_at_risr: {
    eyebrow: "Careers",
    title: "Work at RIS Ratchapruek",
    lede: "Teaching and support roles at a growing campus.",
    admin: "Admin → Work at RISR, and its Leadership / Teaching / Non-teaching lists",
  },
  contact_us: {
    eyebrow: "Contact",
    title: "Contact us",
    lede: "Ask us anything — admissions, visits, or a question about the school.",
    admin: "Admin → Contact (banner), and Admin → Contact Inbox for what arrives",
  },
  staff: {
    eyebrow: "Portals",
    title: "Portals",
    lede: "Sign-in for current families, students and staff.",
    body:
      "OpenApply is where applicants and current families manage admissions, " +
      "documents and payments.\n\n" +
      "The community portal carries the day-to-day links — calendars, forms and " +
      "school notices — for people already at the school.",
    admin: "Admin → Portals",
  },
};

export function copyFor(slug: string): PageCopy {
  const c = PAGE_COPY[slug];
  if (!c) throw new Error(`No page template for "${slug}"`);
  return c;
}
