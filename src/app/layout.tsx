import type { Metadata } from "next";
import { Playfair_Display, Dancing_Script, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnlyYes 💖 Create a Magical Valentine Proposal",
  description: "Create a beautiful, personalized Valentine's proposal website for your partner in just 2 minutes. Make them say YES!",
  keywords: ["valentine", "proposal", "love", "romantic", "surprise", "gift"],
  openGraph: {
    title: "OnlyYes 💖 Create a Magical Valentine Proposal",
    description: "Create a beautiful, personalized Valentine's proposal website for your partner in just 2 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dancing.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
