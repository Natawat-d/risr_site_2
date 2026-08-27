import Link from "next/link";
import { PageHero, Section } from "@/components/site/blocks";

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="We can't find that page"
        lede="It may have moved, or the address may have a typo in it."
      />
      <Section>
        <p className="lede">Some places to try instead:</p>
        <ul style={{ display: "grid", gap: "0.5rem", paddingLeft: "1.15rem" }}>
          <li>
            <Link href="/">The homepage</Link>
          </li>
          <li>
            <Link href="/curriculum">Curriculum, by division</Link>
          </li>
          <li>
            <Link href="/apply_now">How to apply</Link>
          </li>
          <li>
            <Link href="/contact_us">Contact the school</Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
