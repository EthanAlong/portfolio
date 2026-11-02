/**
 * Root layout (server component).
 *
 * Only a server component may export `metadata`, so the page chrome (nav,
 * mode switch, theme) lives in the client component SiteChrome and this file
 * owns the document shell plus the site-wide title, description and share
 * preview. Pages refine it with their own layout.js / generateMetadata.
 */
import "./globals.css"
import SiteChrome from "@/components/site/SiteChrome"

const SITE = "https://www.ethanhdigital.com"
const DESCRIPTION =
  "Ethan Huang: senior BIM & computational designer in Los Angeles. Architecture portfolio and the internal tools, AI agents and Azure platform behind them."

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Ethan Huang · Architecture, Computation, Engineering",
    template: "%s · Ethan Huang",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "EthanDigital",
    url: SITE,
    title: "Ethan Huang · Architecture, Computation, Engineering",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "EthanDigital portfolio" }],
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning={true}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
