import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Marcellus } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "LANA KNYAZEVA — премиальная эстетическая косметология в Ростове-на-Дону",
  description:
    "Премиальная клиника и школа эстетической косметологии LANA KNYAZEVA в Ростове-на-Дону. Эстетическая косметология, лазерная эпиляция, мезотерапия, биоревитализация, ботулинотерапия, контурная пластика. Опытные специалисты, сертифицированные препараты, запись онлайн.",
  keywords: [
    "премиальная косметология",
    "услуги косметолога",
    "эстетическая косметология",
    "лазерная эпиляция",
    "мезотерапия",
    "биоревитализация",
    "ботулинотерапия",
    "контурная пластика",
    "Ростов-на-Дону",
  ],
  authors: [{ name: "LANA KNYAZEVA" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "LANA KNYAZEVA — премиальная эстетическая косметология",
    description:
      "Премиальная клиника и школа эстетической косметологии в Ростове-на-Дону. Сертифицированные препараты, опытные специалисты, индивидуальный подход.",
    siteName: "LANA KNYAZEVA",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "LANA KNYAZEVA — премиальная эстетическая косметология",
    description:
      "Премиальная клиника и школа эстетической косметологии в Ростове-на-Дону.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${marcellus.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
