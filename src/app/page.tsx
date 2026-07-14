'use client';

import { useState, useCallback } from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { Hero } from '@/components/site/hero';
import { About, Marquee } from '@/components/site/about';
import { Services } from '@/components/site/services';
import { Booking } from '@/components/site/booking';
import { Promo } from '@/components/site/promo';
import { Reviews } from '@/components/site/reviews';
import { Contacts, SiteFooter } from '@/components/site/contacts-footer';

export default function Home() {
  const [bookingPreselect, setBookingPreselect] = useState<{
    catId: string;
    idx: number;
  } | null>(null);

  const openBooking = useCallback(() => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleBookService = useCallback((catId: string, idx: number) => {
    setBookingPreselect({ catId, idx });
    setTimeout(() => {
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <Marquee />
      <About />
      <Services onBookService={handleBookService} />
      <Booking preselect={bookingPreselect} onConsumePreselect={() => setBookingPreselect(null)} />
      <Promo onBookClick={openBooking} />
      <Reviews />
      <Contacts />
      <SiteFooter />
    </main>
  );
}
