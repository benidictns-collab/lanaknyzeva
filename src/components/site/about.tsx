'use client';

import { motion } from 'framer-motion';
import { Award, BadgeCheck, LifeBuoy, ShieldCheck } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: Award,
    title: 'Опыт и квалификация',
    text: 'Пятнадцать лет в медицинской практике, регулярное участие в международных конгрессах по эстетической медицине.',
  },
  {
    icon: BadgeCheck,
    title: 'Сертификация',
    text: 'Все препараты и материалы сертифицированы. Документы о квалификации вносятся в официальный реестр.',
  },
  {
    icon: LifeBuoy,
    title: 'Поддержка 24/7',
    text: 'Сопровождение гостя на каждом этапе — от первичной консультации до постпроцедурного контроля и рекомендаций.',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантии результата',
    text: 'Индивидуальный протокол, отслеживание динамики и коррекция курса при необходимости — без скрытых доплат.',
  },
];

export function About() {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="eyebrow">О клинике</span>
          <h2 className="font-serif-display font-normal text-3xl md:text-[3.4rem] leading-[1.15] tracking-tight mt-5">
            Пространство, где <em className="italic text-primary font-medium">наука</em>
            <br />
            встречается с эстетикой
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-start">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-muted-foreground text-base lg:text-[1.02rem] leading-[1.9] mb-5">
              LANA KNYAZEVA — клиника и школа эстетической косметологии, созданная
              специалистом с пятнадцатилетним опытом в медицинской практике. Мы
              соединяем клиническую точность с чувством прекрасного, выстраивая каждый
              протокол вокруг индивидуальных особенностей гостя.
            </p>
            <p className="text-muted-foreground text-base lg:text-[1.02rem] leading-[1.9] mb-9">
              В работе используются исключительно сертифицированные препараты и новейшее
              аппаратное обеспечение. Специалисты клиники регулярно участвуют в
              международных конгрессах и повышают квалификацию, оставаясь на острие
              мировой эстетической медицины.
            </p>
            <blockquote className="font-serif-display italic text-xl lg:text-[1.4rem] leading-[1.5] text-foreground border-l-2 border-primary pl-6">
              «Эстетика — это не про стандарты. Это про гармонию, которую замечаешь, но
              не можешь объяснить словами.»
              <cite className="block not-italic font-sans text-[0.74rem] tracking-[0.22em] uppercase text-primary mt-4">
                Лана Князева — основатель клиники
              </cite>
            </blockquote>
          </motion.div>

          {/* Advantages grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border rounded-sm overflow-hidden"
          >
            {ADVANTAGES.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(24, 24, 24, 1)' }}
                className="bg-background p-7 lg:p-9 group cursor-default"
              >
                <adv.icon className="w-10 h-10 text-primary/80 mb-5 transition-transform group-hover:-translate-y-1 group-hover:text-primary" strokeWidth={1} />
                <h4 className="font-serif-display text-lg lg:text-xl font-medium text-foreground mb-3 leading-snug">
                  {adv.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{adv.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = [
    'Эстетическая косметология',
    'Лазерная эпиляция',
    'Мезотерапия',
    'Биоревитализация',
    'Ботулинотерапия',
    'Контурная пластика',
    'Липолитики',
    'Коллагенотерапия',
  ];
  const doubled = [...items, ...items];
  return (
    <div className="border-t border-b border-border py-5 overflow-hidden bg-card">
      <div className="flex gap-14 whitespace-nowrap animate-marquee w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-serif-display italic text-xl text-muted-foreground/50 flex items-center gap-14"
          >
            {item}
            <span className="text-primary text-sm not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
