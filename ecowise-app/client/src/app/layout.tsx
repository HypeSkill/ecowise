import type { Metadata } from "next";
import { Instrument_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";
import Header from "./components/Header";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EcoWise – Eco-smart AI Trip Planner",
  description: "Plan low-carbon trips with AI-powered recommendations and impact insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrument.variable} ${space.variable} antialiased bg-site text-site`}
      >
        <Header userName={null} avatarUrl={null} />
        {children}
      </body>
    </html>
  );
}
