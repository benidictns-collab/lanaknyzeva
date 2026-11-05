'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { mapsUrl, searchServices, siteUrl } from '@/lib/site/search';
import { SiteHeader } from '@/components/site/site-header';
import { Hero } from '@/components/site/hero';
import { About, Marquee } from '@/components/site/about';
import { Services } from '@/components/site/services';
import { Booking, trackBookingOpen } from '@/components/site/yclients-booking';
import { Promo } from '@/components/site/promo';
import { Reviews } from '@/components/site/reviews';
import { Contacts, SiteFooter } from '@/components/site/contacts-footer';

const business = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Школа Косметологов Князевой Л.',
  alternateName: 'LANA KNYAZEVA',
  url: siteUrl,
  image: `${siteUrl}/promo-cosmetology.jpg`,
  telephone: '+79885350637',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Социалистическая улица, 140',
    addressLocality: 'Ростов-на-Дону',
    postalCode: '344006',
    addressCountry: 'RU',
  },
  hasMap: mapsUrl,
};

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = useCallback(() => {
    trackBookingOpen();
    setBookingOpen(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }} />
      <SiteHeader onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <Marquee />
      <About />
      <Services onBookService={openBooking} />
      <nav aria-labelledby="popular-services" className="mx-auto w-full max-w-[1440px] px-5 pb-12 md:px-[clamp(20px,5vw,100px)]">
        <h2 id="popular-services" className="font-serif-display text-2xl">Популярные услуги</h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {searchServices.map(({ slug, name }) => (
            <li key={slug}><Link href={`/uslugi/${slug}`} prefetch={false} className="text-primary underline">{name}</Link></li>
          ))}
        </ul>
      </nav>
      <Booking open={bookingOpen} onOpenChange={setBookingOpen} onBookClick={openBooking} />
      <Promo onBookClick={openBooking} />
      <Reviews />
      <Contacts />
      <SiteFooter />
    </main>
  );
}
