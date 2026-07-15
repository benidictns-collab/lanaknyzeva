'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const STATS = [
  { num: '15', label: 'лет практики' },
  { num: '9', label: 'направлений' },
  { num: '24/7', label: 'поддержка гостей' },
  { num: '100%', label: 'сертифицированные препараты' },
];

type HeroProps = {
  onBookClick: () => void;
};

export function Hero({ onBookClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-32 pb-20"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 75% 30%, rgba(201, 162, 39, 0.18) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(120, 30, 40, 0.22) 0%, transparent 55%), linear-gradient(180deg, #0A0A0A 0%, #100808 60%, #0A0A0A 100%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,162,39,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] w-full px-5 md:px-[clamp(20px,5vw,100px)]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.span variants={item} className="eyebrow inline-flex">
              Эстетическая косметология · Ростов-на-Дону
            </motion.span>

            <motion.h1
              variants={item}
              className="font-serif-display font-normal text-4xl sm:text-5xl lg:text-[5rem] leading-[1.05] tracking-tight mt-6 mb-7"
            >
              <span className="block">Искусство</span>
              <span className="block">
                <em className="italic text-primary font-medium">безупречной</em> кожи
              </span>
              <span className="block">и точёных линий</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-base lg:text-[1.05rem] text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-[1.85] mb-10"
            >
              Премиальная клиника и школа эстетической косметологии. Инъекционные и
              аппаратные методики, сертифицированные препараты и индивидуальный протокол
              для каждого гостя.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-14"
            >
              <Button
                onClick={onBookClick}
                className="bg-gold-gradient hover:shadow-gold-glow text-background hover:bg-primary border border-primary text-xs font-medium tracking-[0.22em] uppercase rounded-sm px-8 py-[15px] transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Записаться на приём
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-[15px] text-xs font-medium tracking-[0.22em] uppercase rounded-sm border border-primary text-primary hover:bg-primary hover:text-background transition-all duration-300"
              >
                Каталог услуг
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 pt-9 border-t border-border"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="text-center lg:text-left"
                >
                  <div className="font-serif-display text-2xl lg:text-[2.2rem] font-medium text-primary leading-none">
                    {stat.num}
                  </div>
                  <div className="text-[0.72rem] tracking-[0.18em] uppercase text-muted-foreground/70 mt-2">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] rounded-sm overflow-hidden border border-gold-soft max-w-md mx-auto w-full"
          >
            <img
              src="/hero-mesotherapy.jpg"
              alt="Процедура мезотерапии лица — инъекционное омоложение премиальной клиники LANA KNYAZEVA"
              className="w-full h-full object-cover brightness-[0.82] saturate-[0.95] transition-transform duration-[8s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="text-[0.66rem] tracking-[0.3em] uppercase text-primary mb-2">
                Мезотерапия лица
              </p>
              <p className="font-serif-display italic text-base text-foreground leading-snug">
                Инъекционный коктейль витаминов и пептидов для омоложения
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
