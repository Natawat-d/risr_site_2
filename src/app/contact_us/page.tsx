import type { Metadata } from "next";
import { PageHero, Section } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { media, pick, row } from "@/lib/content";
import { copyFor } from "@/lib/page-copy";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = copyFor("contact_us");
export const metadata: Metadata = { title: copy.title, description: copy.lede };

/**
 * The address and telephone number are hard-coded here, as they are in the
 * footer, because the `contact` table holds one column and it is the banner
 * image — there is nowhere in the CMS to edit them. Worth a table of its own
 * eventually; noted in the report rather than invented here.
 */
export default async function Page() {
  const r = await row("contact");

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        image={media(pick(r.contact_banner))}
      />

      <Section>
        <div className={styles.layout}>
          <div>
            <h2 className={styles.formTitle}>Send us a message</h2>
            <p className="lede" style={{ marginBottom: "2rem" }}>
              Enquiries reach the school office and are passed to admissions,
              a division or HR as appropriate.
            </p>
            <ContactForm />
          </div>

          <aside className={styles.aside}>
            <div className={styles.block}>
              <h3>Campus</h3>
              <address>
                Ruamrudee International School
                <br />
                Ratchapruek Campus
                <br />
                999 Moo 4, Bang Kruai – Sai Noi Road
                <br />
                Bang Krang, Mueang Nonthaburi
                <br />
                Nonthaburi 11000, Thailand
              </address>
            </div>
            <div className={styles.block}>
              <h3>Telephone</h3>
              <p>
                <a href="tel:+6620300533">+66 (0)2 030 0533</a>
              </p>
            </div>
            <div className={styles.block}>
              <h3>Office hours</h3>
              <p>Monday to Friday, 7.30am – 4.00pm</p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="sand" eyebrow="Find us" title="Getting to campus">
        <div className={styles.map}>
          <iframe
            title="RIS Ratchapruek campus map"
            src="https://www.google.com/maps?q=Ruamrudee+International+School+Ratchapruek&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>
    </>
  );
}
