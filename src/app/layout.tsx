import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display, Marcellus } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { siteUrl } from "@/lib/site/search";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  preload: false,
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
});

const title = "Косметология в Ростове-на-Дону | LANA KNYAZEVA";
const description =
  "Косметология LANA KNYAZEVA в Ростове-на-Дону. Чистка лица, карбоновый пилинг, СМАС-лифтинг и лазерная эпиляция. Цены и онлайн-запись.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title,
  description,
  icons: { icon: "/logo.png" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "LANA KNYAZEVA",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/promo-cosmetology.jpg", alt: "Косметология LANA KNYAZEVA" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/promo-cosmetology.jpg"],
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
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j=0;j<document.scripts.length;j++) {
                if (document.scripts[j].src===r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=114052429','ym');
            ym(114052429,'init',{
              ssr:true,
              clickmap:true,
              ecommerce:'dataLayer',
              referrer:document.referrer,
              url:location.href,
              accurateTrackBounce:true,
              trackLinks:true
            });
          `}
        </Script>
        <noscript>
          <div>
            {/* The tracking pixel is required for visits without JavaScript. */}
            <img
              src="https://mc.yandex.ru/watch/114052429"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
