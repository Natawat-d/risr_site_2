import assert from "node:assert/strict";
import { test } from "node:test";
import { blocks, clean, docUrl, embeddable, real } from "./text.ts";

/*
 * Every string below is copied out of the production database. The parser has
 * to tell three things apart that a line break alone cannot, so these are the
 * cases that matter rather than invented ones.
 *
 *   node --experimental-strip-types --test src/lib/text.test.ts
 */

/** Encode ASCII as the Unicode Mathematical Bold the CMS authors paste in. */
const fakeBold = (s: string) =>
  String.fromCodePoint(
    ...[...s].map((c) =>
      /[A-Z]/.test(c)
        ? 0x1d400 + c.charCodeAt(0) - 65
        : /[a-z]/.test(c)
          ? 0x1d41a + c.charCodeAt(0) - 97
          : c.codePointAt(0)!,
    ),
  );

test("a run of short lines is a list, not a stack of paragraphs", () => {
  assert.deepEqual(blocks("Pre-K 2 - 2 years\r\nPre-K 3 - 3 years\r\nPre-K 4 - 4 years"), [
    { kind: "ul", items: ["Pre-K 2 - 2 years", "Pre-K 3 - 3 years", "Pre-K 4 - 4 years"] },
  ]);
});

test("hard-wrapped prose is one paragraph, not three", () => {
  const wrapped =
    "Welcome to Ruamrudee International School Ratchapruek Campus. RIS History - Ruamrudee is\r\n" +
    "a Thai word meaning “union of hearts,” and this name perfectly captures the school’s\r\n" +
    "philosophy of welcoming all children into an environment of care and compassion.";
  const out = blocks(wrapped);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, "p");
  assert.match(out[0].kind === "p" ? out[0].text : "", /Ruamrudee is a Thai word/);
});

test("a short line above prose is the heading the author meant", () => {
  const out = blocks(
    "ELEMENTARY: OCEAN GUARDIANS\r\nThis summer, elementary students will become Ocean " +
      "Guardians as they explore UNSDG Goal 14: Life Below Water across every subject.",
  );
  assert.equal(out[0].kind, "h");
  assert.equal(out[1].kind, "p");
});

test("bullets become a list and lose their markers", () => {
  assert.deepEqual(blocks("• Creative\r\n• Critical thinkers\r\n• Open-minded"), [
    { kind: "ul", items: ["Creative", "Critical thinkers", "Open-minded"] },
  ]);
});

test("an opening line on its own is a heading", () => {
  const out = blocks(
    "Why Participate in EDP?\r\n\r\nThe Extended Day Program offers a stimulating blend of " +
      "fun and educational experiences that make a long afternoon worth staying for.",
  );
  assert.deepEqual(out[0], { kind: "h", text: "Why Participate in EDP?" });
});

test("a line ending in a colon is a heading, and loses the colon", () => {
  const out = blocks("Highlights:\r\n\r\n• Gold Award\r\n• Top School Award");
  assert.deepEqual(out[0], { kind: "h", text: "Highlights" });
});

test("pasted Mathematical Bold is folded back to letters", () => {
  const out = blocks(
    `${fakeBold("The Creative Curriculum")}\r\n\r\nThe 32 Creative Curriculum Units of ` +
      "Study provide the foundation for teaching and learning in an Early Years classroom.",
  );
  assert.deepEqual(out[0], { kind: "h", text: "The Creative Curriculum" });
  assert.equal(clean(fakeBold("Standards")), "Standards");
});

test("placeholder and stub values render nothing", () => {
  assert.deepEqual(blocks("[value-6]"), []);
  assert.equal(real("[value-15]"), false);
  assert.equal(real("Test"), false);
  assert.equal(real("testimg"), false);
  assert.equal(real("Testing our new pool"), true);
});

test("link fields are only trusted when they point at a document", () => {
  assert.equal(docUrl("www.google.com"), "");
  assert.equal(docUrl("[value-7]"), "");
  assert.match(docUrl("https://drive.google.com/file/d/abc/view"), /^https:\/\/drive\.google\.com/);
  assert.match(docUrl("https://www.canva.com/design/X/view"), /canva\.com/);
});

test("a Drive /view link is turned into an embeddable /preview", () => {
  assert.equal(
    embeddable("https://drive.google.com/file/d/abc123/view?usp=drive_link"),
    "https://drive.google.com/file/d/abc123/preview",
  );
});
