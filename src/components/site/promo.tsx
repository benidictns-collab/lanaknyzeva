'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PromoProps = {
  onBookClick: () => void;
};

export function Promo({ onBookClick }: PromoProps) {
  return (
    <section
      id="promo"
      className="py-20 lg:py-32 border-t border-border border-b border-border overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #100808 0%, #0A0A0A 100%)' }}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] rounded-sm overflow-hidden border border-gold-soft max-w-md mx-auto w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=85"
              alt="Интерьер премиального спа-кабинета в тёплом свете"
              loading="lazy"
              className="w-full h-full object-cover brightness-[0.85] saturate-[0.95]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10,10,10,0.4) 0%, transparent 50%, rgba(201,162,39,0.15) 100%)',
              }}
            />
            <div className="absolute top-6 right-6 w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-primary text-background grid place-items-center text-center font-serif-display font-semibold z-10 animate-spin-slow">
              <div>
                <span className="block text-2xl lg:text-[2rem] leading-none">−50%</span>
                <small className="block font-sans text-[0.55rem] tracking-[0.22em] uppercase mt-1 font-medium">
                  раз в месяц
                </small>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="eyebrow">Специальное предложение</span>
            <h2 className="font-serif-display text-3xl md:text-[3rem] leading-[1.15] mt-5 mb-5">
              Счастливый <em className="italic text-primary font-medium">клиентский</em> день
            </h2>
            <p className="text-muted-foreground text-base leading-[1.85] mb-5 max-w-md">
              Раз в месяц мы открываем двери для особого дня, когда избранные процедуры
              доступны со скидкой до пятидесяти процентов. Это наша традиция благодарности
              гостям, которые доверяют нам свою красоту.
            </p>
            <ul className="mb-8 flex flex-col gap-3">
              {[
                'Скидка 50% на эстетические процедуры лица',
                'Приоритетная запись для постоянных гостей',
                'Индивидуальная консультация в подарок',
                'Подарочный сертификат для близкого человека',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 flex-shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button
              onClick={onBookClick}
              className="bg-gold-gradient hover:shadow-gold-glow text-background hover:bg-primary border border-primary text-xs font-medium tracking-[0.22em] uppercase rounded-sm px-8 py-[15px] transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Узнать дату следующего дня
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
