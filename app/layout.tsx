import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jikmis Apartment | Luxury Serviced Apartments in Boudha",
    template: "%s | Jikmis Apartment"
  },
  description:
    "Luxury serviced apartments in Boudha, Kathmandu with studio rooms, family rooms, direct booking, and AI receptionist support."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
