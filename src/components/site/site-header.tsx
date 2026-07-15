'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '#about', label: 'О клинике' },
  { href: '#services', label: 'Услуги' },
  { href: '#booking', label: 'Запись' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
];

type HeaderProps = {
  onBookClick: () => void;
};

export function SiteHeader({ onBookClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-background/92 backdrop-blur-xl border-b border-border'
            : 'py-5 bg-gradient-to-b from-background/85 to-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <Link
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="flex-shrink-0"
              aria-label="LANA KNYAZEVA — на главную"
            >
              <motion.img
                src="/logo.png"
                alt="LANA KNYAZEVA — премиальная клиника эстетической косметологии"
                className={`block w-auto object-contain drop-shadow-[0_2px_12px_rgba(201,162,39,0.18)] transition-all duration-500 ${
                  scrolled ? 'h-11 md:h-12' : 'h-12 md:h-14'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex flex-1 justify-center gap-4 xl:gap-7"
              aria-label="Основная навигация"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="relative text-xs xl:text-[0.78rem] tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1.5 whitespace-nowrap group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-5 flex-shrink-0 ml-auto lg:ml-0">
              <a
                href="tel:+79885350637"
                className="hidden xl:flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>+7 988 535-06-37</span>
              </a>
              <Button
                onClick={onBookClick}
                className="bg-gold-gradient hover:shadow-gold-glow text-background hover:bg-primary border border-primary text-xs md:text-[0.74rem] font-medium tracking-[0.22em] uppercase rounded-sm px-5 md:px-8 py-3 md:py-[15px] transition-all duration-300 hover:-translate-y-0.5"
              >
                Записаться
              </Button>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                aria-label="Открыть меню"
                aria-expanded={mobileOpen}
              >
                <span className="w-6 h-0.5 bg-foreground" />
                <span className="w-6 h-0.5 bg-foreground" />
                <span className="w-6 h-0.5 bg-foreground" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 z-[70] h-[100dvh] w-[min(85vw,360px)] bg-card border-l border-border shadow-[-20px_0_40px_rgba(0,0,0,0.4)] flex flex-col lg:hidden"
            >
              <div className="pt-20 pb-8 px-7 flex flex-col gap-0 flex-1 overflow-y-auto">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className="block font-serif-display text-xl text-foreground hover:text-primary transition-colors py-4 border-b border-border"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    onBookClick();
                  }}
                  className="mt-6 w-full bg-gold-gradient text-background hover:shadow-gold-glow rounded-sm"
                >
                  Записаться
                </Button>
              </div>
              <div className="mt-auto pt-8 pb-6 px-7 border-t border-border">
                <p className="text-[0.66rem] tracking-[0.2em] uppercase text-primary font-medium mb-2">
                  Контакты
                </p>
                <a
                  href="tel:+79885350637"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  +7 988 535-06-37
                </a>
                <p className="text-xs text-muted-foreground/70 py-1 leading-relaxed">
                  г. Ростов-на-Дону,
                  <br />
                  ул. Социалистическая, 140
                </p>
                <p className="text-xs text-muted-foreground/70 py-1">
                  Ежедневно, 09:00 — 21:00
                </p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:rotate-90 transition-all"
                aria-label="Закрыть меню"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
