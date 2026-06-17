import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tsewangbista.vercel.app"),
  title: {
    default: "TsewangBistaX | Technology, Business & Innovation",
    template: "%s | TsewangBistaX"
  },
  description:
    "Portfolio of Tsewang Bista, an entrepreneur, software developer, AI marketer, business owner, and hospitality professional from Kathmandu, Nepal.",
  keywords: [
    "Tsewang Bista",
    "TsewangBistaX",
    "React developer Nepal",
    "AI marketing specialist Nepal",
    "digital marketer Kathmandu",
    "Mustang apple farming",
    "shoe business Nepal",
    "hospitality professional Nepal"
  ],
  authors: [{ name: "Tsewang Bista" }],
  creator: "Tsewang Bista",
  openGraph: {
    title: "TsewangBistaX",
    description: "Where Technology, Business & Innovation Meet.",
    url: "https://tsewangbista.vercel.app",
    siteName: "TsewangBistaX",
    images: [
      {
        url: "/images/tsewang-bista-profile.jpeg",
        width: 1200,
        height: 1500,
        alt: "Tsewang Bista"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "TsewangBistaX",
    description: "Where Technology, Business & Innovation Meet.",
    images: ["/images/tsewang-bista-profile.jpeg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
