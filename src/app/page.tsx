'use client';

import { useState, useCallback } from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { Hero } from '@/components/site/hero';
import { About, Marquee } from '@/components/site/about';
import { Services } from '@/components/site/services';
import { Booking, trackBookingOpen } from '@/components/site/yclients-booking';
import { Promo } from '@/components/site/promo';
import { Reviews } from '@/components/site/reviews';
import { Contacts, SiteFooter } from '@/components/site/contacts-footer';

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = useCallback(() => {
    trackBookingOpen();
    setBookingOpen(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <Marquee />
      <About />
      <Services onBookService={openBooking} />
      <Booking open={bookingOpen} onOpenChange={setBookingOpen} onBookClick={openBooking} />
      <Promo onBookClick={openBooking} />
      <Reviews />
      <Contacts />
      <SiteFooter />
    </main>
  );
}
