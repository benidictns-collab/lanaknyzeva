'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function trackBookingOpen() {
  // A blocked analytics script must never prevent booking.
  try {
    const ym = (window as Window & { ym?: (...args: unknown[]) => void }).ym;
    ym?.(114052429, 'reachGoal', 'booking_open');
  } catch {
    // Booking remains available when tracking is unavailable.
  }
}

function bookingUrl() {
  const url = new URL('https://n2289117.yclients.ru/');
  const current = new URLSearchParams(window.location.search);
  // Only forward campaign attribution, not arbitrary query parameters or contact data.
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid']) {
    const value = current.get(key);
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

function BookingFrame() {
  const [src] = useState(bookingUrl);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(timer);
  }, [attempt]);

  return (
    <>
      <div className="relative min-h-0 flex-1 bg-white">
        {!loaded && <p role="status" className="absolute inset-x-0 top-6 text-center text-sm text-neutral-600">Загружаем расписание…</p>}
        <iframe key={attempt} src={src} title="Выбор услуги и времени — запись в YCLIENTS" className="relative h-full w-full border-0" allow="payment" onLoad={() => setLoaded(true)} />
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs">
        <span className="text-muted-foreground">{slow && !loaded ? 'Расписание загружается дольше обычного.' : 'Не получается загрузить форму?'}</span>
        <button type="button" className="text-primary underline" onClick={() => { setLoaded(false); setSlow(false); setAttempt(value => value + 1); }}>Повторить</button>
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary underline">Открыть отдельно</a>
      </div>
    </>
  );
}

export function Booking({ open, onOpenChange, onBookClick }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookClick: () => void;
}) {
  return (
    <>
      <section id="booking" className="scroll-mt-24 border-y border-border bg-card px-5 py-20 text-center">
        <span className="eyebrow">Онлайн-запись</span>
        <h2 className="mt-5 font-serif-display text-3xl md:text-5xl">Выберите удобное время</h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">Выберите услугу, специалиста и свободное время в актуальном расписании.</p>
        <button type="button" onClick={onBookClick} className="mt-8 rounded-sm bg-gold-gradient px-8 py-4 text-background hover:shadow-gold-glow">Выбрать время и записаться</button>
      </section>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="z-[100] flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[min(850px,92dvh)] sm:max-w-[600px] sm:rounded-xl">
          <div className="shrink-0 border-b border-border px-5 py-4 pr-12">
            <DialogTitle className="font-serif-display text-xl">Запись на приём</DialogTitle>
            <DialogDescription className="mt-1">Лана Князева · расписание YCLIENTS</DialogDescription>
          </div>
          {open && <BookingFrame />}
        </DialogContent>
      </Dialog>
    </>
  );
}
