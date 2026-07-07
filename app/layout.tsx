import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-vercel-domain.vercel.app"),
  title: {
    default: "TsewangBistaX | Technology, Business & Innovation",
    template: "%s | TsewangBistaX"
  },
  description:
    "Premium portfolio of Tsewang Bista, a developer, AI marketer, entrepreneur, business owner, and hospitality professional from Kathmandu, Nepal.",
  keywords: [
    "Tsewang Bista",
    "TsewangBistaX",
    "AI marketer Nepal",
    "Next.js developer Nepal",
    "UI UX designer Nepal",
    "shoe business Nepal",
    "Mustang apple farming"
  ],
  openGraph: {
    title: "TsewangBistaX",
    description: "Where Technology, Business & Innovation Meet.",
    images: ["/images/tsewang-bista-profile.jpeg"],
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
