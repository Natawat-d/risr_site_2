import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { media, row } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await row("branding");
  return {
    title: {
      default: "Ruamrudee International School · Ratchapruek Campus",
      template: "%s · RIS Ratchapruek",
    },
    description:
      "A Catholic school offering an interfaith, inclusive and academically " +
      "rigorous education in Nonthaburi, Bangkok.",
    icons: media(brand.favicon) ? { icon: media(brand.favicon) } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Bebas Neue is the school's existing display face, already used on
            risr.ac.th. Loaded on its own rather than dragging in Bootstrap. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
