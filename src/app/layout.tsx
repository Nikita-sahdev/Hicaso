import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Adamina, Bricolage_Grotesque, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Testimonial quotes (DESIGN.md "Customer Story Carousel Card").
const adamina = Adamina({
  variable: "--font-adamina",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Product fonts: used only inside product-themed surfaces.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hicaso — software development and product studio",
  description: `Hicaso builds generative AI, agentic AI, mobile and web software for clients worldwide, and ships its own products, including ${products.map((p) => p.name).join(" and ")}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} ${adamina.variable} ${bricolage.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
