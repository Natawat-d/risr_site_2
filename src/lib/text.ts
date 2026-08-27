/*
 * Text handling for CMS fields.
 *
 * Deliberately free of any database import: these are pure string functions,
 * which is what makes them testable on their own (`npm run test:text`).
 */

/**
 * Normalise CMS text.
 *
 * Whoever writes this content types "bold" by pasting Unicode Mathematical
 * Alphanumeric characters — `𝐒𝐭𝐚𝐧𝐝𝐚𝐫𝐝𝐬`, `𝙋𝙪𝙧𝙥𝙤𝙨𝙚 𝙤𝙛 𝙩𝙝𝙚 𝙃𝙤𝙪𝙨𝙚 𝙎𝙮𝙨𝙩𝙚𝙢` — because
 * the old editor is a plain textarea with no formatting. They are not letters:
 * a screen reader says "mathematical bold capital S", they don't match a
 * find-on-page, and no font can style them. NFKC has a compatibility mapping
 * back to ASCII for every one of them, so one call undoes the lot and CSS does
 * the emphasis instead. It also folds ligatures and full-width forms, which is
 * wanted for the same reason.
 */
export function clean(value: unknown): string {
  return (value ?? "").toString().normalize("NFKC").replace(/[\u00a0\u200b]/g, " ");
}

/** Plain text from the CMS, as paragraphs. Legacy fields hold no markup. */
export function paragraphs(value: unknown): string[] {
  return clean(value)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

const BULLET = /^\s*[•·‣▪*-]\s+/;

/** Short, and not the end of a sentence — the shape of a heading or a list row. */
const isShort = (l: string) => l.length <= 90 && !/[.;]$/.test(l);
const isProse = (l: string) => l.length > 90;

/**
 * Structure a legacy textarea field.
 *
 * These fields are the only place the school can type, and they carry real
 * structure done by hand: a title line, blank lines between paragraphs, `•`
 * bullets, and — because the old editor is a fixed-width textarea — paragraphs
 * hard-wrapped mid-sentence. The old site pushed the lot through `nl2br`, which
 * turned a twelve-item list and a wrapped paragraph into the same grey wall.
 *
 * Reading that structure back out is what makes the same content look like a
 * page, and it has to distinguish three things a bare line break cannot:
 *
 * - `Pre-K 2 - 2 years` over three lines is a **list**, not three paragraphs.
 * - `…Ruamrudee is` / `a Thai word meaning…` is **one paragraph** the author
 *   wrapped by hand, not two.
 * - `ELEMENTARY: OCEAN GUARDIANS` above a long line is a **heading**.
 *
 * The signal for all three is line length: a run of short lines is a list, a
 * run of long ones is wrapped prose, and a short line on top of long ones is a
 * title. Nothing else in the data distinguishes them.
 */
export function blocks(value: unknown): Block[] {
  const text = clean(value).replace(/\r\n?/g, "\n");
  if (!real(text)) return [];

  const out: Block[] = [];
  const chunks = text.split(/\n\s*\n/).filter((c) => c.trim());

  chunks.forEach((chunk, index) => {
    let lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;

    // A short line sitting on top of prose is the heading the author meant.
    if (lines.length > 1 && !BULLET.test(lines[0]) && isShort(lines[0]) && lines.slice(1).some(isProse)) {
      out.push({ kind: "h", text: lines[0].replace(/:$/, "") });
      lines = lines.slice(1);
    }

    // A single line that is short, or ends in a colon, and is not the whole
    // field, is also a heading — "Highlights:", "Dates & Times".
    if (
      lines.length === 1 &&
      chunks.length > 1 &&
      !BULLET.test(lines[0]) &&
      (index === 0 || /:$/.test(lines[0])) &&
      isShort(lines[0])
    ) {
      out.push({ kind: "h", text: lines[0].replace(/:$/, "") });
      return;
    }

    // Bulleted, or an unbulleted run of short lines: both are lists.
    const bulleted = lines.filter((l) => BULLET.test(l)).length;
    if (bulleted && bulleted === lines.length) {
      out.push({ kind: "ul", items: lines.map((l) => l.replace(BULLET, "").trim()) });
      return;
    }
    if (!bulleted && lines.length > 1 && lines.every(isShort)) {
      out.push({ kind: "ul", items: lines });
      return;
    }

    // Otherwise: bullet runs stay lists, and everything between them is one
    // paragraph — the line breaks inside it are the textarea's, not the
    // author's.
    let para: string[] = [];
    let items: string[] = [];
    const flushPara = () => {
      if (para.length) out.push({ kind: "p", text: para.join(" ") });
      para = [];
    };
    const flushItems = () => {
      if (items.length) out.push({ kind: "ul", items });
      items = [];
    };
    for (const line of lines) {
      if (BULLET.test(line)) {
        flushPara();
        items.push(line.replace(BULLET, "").trim());
      } else {
        flushItems();
        para.push(line);
      }
    }
    flushPara();
    flushItems();
  });

  return out;
}

/**
 * True when a CMS value is worth rendering.
 *
 * Five pages carry `[value-2]`-style placeholders written into the legacy
 * database by an automated attack in 2024. They are live on risr.ac.th today
 * and were carried across faithfully — but a redesign is the right moment to
 * stop printing them, so sections built only from placeholder text are skipped
 * rather than shown to a parent.
 *
 * Three more fields hold a bare "Test"/"testimg" left behind by somebody trying
 * the editor out — `pop.title`, `pop.content1`, `counseling.title`. Same
 * treatment: the page falls back to its template copy instead.
 */
export function real(value: unknown): boolean {
  const s = (value ?? "").toString().trim();
  return !!s && !/^\[value-\d+\]$/.test(s) && !/^\s*(test|testing|testimg)\s*$/i.test(s);
}

/** First value that is real, else "". */
export function pick(...values: unknown[]): string {
  for (const v of values) if (real(v)) return clean(v).trim();
  return "";
}

/**
 * A CMS link field, if it actually points at a document.
 *
 * The link columns are free text and hold whatever was to hand: real Drive and
 * Canva links on most pages, `www.google.com` on the Counseling row, and
 * `[value-7]` on three others. An allowlist is the only honest filter — a
 * "Download the prospectus" button that opens google.com is worse than no
 * button, and the school cannot see the difference from inside the editor.
 */
const DOC_HOSTS = /^(drive|docs)\.google\.com$|(^|\.)canva\.com$/;

export function docUrl(url: unknown): string {
  const raw = pick(url);
  if (!raw) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (DOC_HOSTS.test(u.hostname) || /\.pdf$/i.test(u.pathname)) return u.toString();
  } catch {
    /* not a URL at all */
  }
  return "";
}

/**
 * A Google Drive / Docs / Canva share link as something embeddable.
 *
 * The CMS holds whatever the author copied out of the address bar, which is
 * usually a `/view` link. In an iframe that renders a Drive chrome page asking
 * you to sign in; `/preview` renders the document. The old site embedded the
 * raw value and several pages showed a permission wall instead of the
 * prospectus.
 */
export function embeddable(url: unknown): string {
  const u = docUrl(url);
  if (!u) return "";
  return u
    .replace(/\/view\b[^]*$/, "/preview")
    .replace(/\/edit\b[^]*$/, "/preview")
    .replace(/([?&])usp=[^&]*/g, "$1")
    .replace(/[?&]$/, "");
}
