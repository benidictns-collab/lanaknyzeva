'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { REVIEWS } from '@/lib/site/data';

export function Reviews() {
  return (
    <section id="reviews" className="py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="eyebrow center inline-flex">Отзывы гостей</span>
          <h2 className="font-serif-display font-normal text-3xl md:text-[3.4rem] leading-[1.15] tracking-tight mt-5">
            Слова, которые <em className="italic text-primary font-medium">дороже рекламы</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Подлинные впечатления наших гостей — основа доверия и мотивация совершенствовать
            сервис каждый день.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-sm p-7 lg:p-8 transition-colors hover:border-gold-soft"
            >
              <div className="font-serif-display text-3xl text-primary leading-none h-6 opacity-70">
                &ldquo;
              </div>
              <div className="flex gap-1 my-3.5">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>
              <p className="font-serif-display italic text-base text-foreground leading-[1.75] mb-5">
                {review.text}
              </p>
              <div className="flex items-center gap-3.5 pt-4 border-t border-border">
                <div className="w-11 h-11 rounded-full bg-gold-gradient grid place-items-center font-serif-display font-semibold text-background">
                  {review.initials}
                </div>
                <div>
                  <div className="font-serif-display text-base text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground/70 tracking-wide mt-0.5">
                    {review.meta}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
