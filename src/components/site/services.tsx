'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, AlertCircle, ClipboardList, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CATEGORIES, SERVICES, type Service, type Category } from '@/lib/site/data';

type ServicesProps = {
  onBookService: (catId: string, idx: number) => void;
};

export function Services({ onBookService }: ServicesProps) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [modalService, setModalService] = useState<Service | null>(null);
  const [modalCategory, setModalCategory] = useState<Category | null>(null);
  const [modalIdx, setModalIdx] = useState<number>(0);

  const services = SERVICES[activeCat] || [];
  const activeCategory = CATEGORIES.find((c) => c.id === activeCat)!;

  const handleCardClick = (idx: number) => {
    setModalService(services[idx]);
    setModalCategory(activeCategory);
    setModalIdx(idx);
  };

  return (
    <section id="services" className="py-20 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-14"
        >
          <div>
            <span className="eyebrow">Каталог услуг</span>
            <h2 className="font-serif-display font-normal text-3xl md:text-[3.4rem] leading-[1.15] tracking-tight mt-5">
              Девять направлений
              <br />
              <em className="italic text-primary font-medium">одной философии</em>
            </h2>
          </div>
          <p className="text-muted-foreground text-base max-w-md leading-relaxed lg:text-right">
            Полный прайс услуг клиники. Выберите категорию, чтобы увидеть детали —
            длительность, стоимость и возможность записи.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-12 pb-7 border-b border-border"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-5 py-3 text-xs font-medium tracking-[0.16em] uppercase rounded-sm border transition-all duration-300 whitespace-nowrap ${
                activeCat === cat.id
                  ? 'bg-gold-gradient text-background border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Service grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map((svc, i) => (
              <motion.article
                key={svc.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => handleCardClick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(i);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Подробнее об услуге: ${svc.name}`}
                className="group bg-card border border-border rounded-sm p-6 flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary relative overflow-hidden min-w-0"
              >
                <span className="absolute top-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                <div className="flex justify-between items-start gap-3 mb-4">
                  <h3 className="font-serif-display text-lg font-medium text-foreground leading-snug flex-1 min-w-0 break-words">
                    {svc.name}
                  </h3>
                  <span className="font-serif-display text-base text-primary font-medium whitespace-nowrap">
                    {svc.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 min-w-0 break-words">
                  {svc.brief}
                </p>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 tracking-wide">
                    <Clock className="w-3 h-3 text-primary/70" />
                    {svc.dur}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-primary transition-all group-hover:gap-3">
                    Подробнее
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Service modal */}
      <Dialog
        open={!!modalService}
        onOpenChange={(open) => !open && setModalService(null)}
      >
        <DialogContent className="max-w-2xl bg-gradient-to-b from-card to-background border border-gold-soft p-0 overflow-hidden max-h-[calc(100dvh-40px)] overflow-y-auto">
          {modalService && modalCategory && (
            <div className="p-6 md:p-10">
              <span className="inline-block text-[0.68rem] font-medium tracking-[0.32em] uppercase text-primary mb-3">
                {modalCategory.name}
              </span>
              <h3 className="font-serif-display text-2xl md:text-[2.2rem] font-medium leading-tight text-foreground mb-3 pr-10">
                {modalService.name}
              </h3>
              <p className="font-serif-display italic text-lg text-primary leading-snug mb-7">
                {modalService.brief}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border rounded-sm overflow-hidden mb-7">
                <div className="bg-card p-5 flex flex-col gap-1.5">
                  <span className="text-[0.66rem] tracking-[0.22em] uppercase text-muted-foreground/70">
                    Стоимость
                  </span>
                  <span className="font-serif-display text-xl text-primary font-medium">
                    {modalService.price}
                  </span>
                </div>
                <div className="bg-card p-5 flex flex-col gap-1.5">
                  <span className="text-[0.66rem] tracking-[0.22em] uppercase text-muted-foreground/70">
                    Длительность
                  </span>
                  <span className="font-serif-display text-xl text-foreground font-medium">
                    {modalService.dur}
                  </span>
                </div>
              </div>

              <div className="divider-line mb-7" />

              {/* Description */}
              <div className="mb-7">
                <h4 className="flex items-center gap-2.5 text-[0.7rem] font-medium tracking-[0.26em] uppercase text-primary mb-3.5">
                  <span className="w-5 h-px bg-primary" />
                  Описание процедуры
                </h4>
                <p className="text-muted-foreground text-[0.98rem] leading-[1.85]">
                  {modalService.desc}
                </p>
              </div>

              {/* Info cards */}
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <div className="bg-card border border-border rounded-sm p-5">
                  <Sparkles className="w-5 h-5 text-primary mb-3" strokeWidth={1.2} />
                  <h5 className="font-serif-display text-base font-medium text-foreground mb-2">
                    Результат
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {modalCategory.effects}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-sm p-5">
                  <AlertCircle className="w-5 h-5 text-primary mb-3" strokeWidth={1.2} />
                  <h5 className="font-serif-display text-base font-medium text-foreground mb-2">
                    Противопоказания
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {modalCategory.contra}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-sm p-5">
                  <ClipboardList className="w-5 h-5 text-primary mb-3" strokeWidth={1.2} />
                  <h5 className="font-serif-display text-base font-medium text-foreground mb-2">
                    Подготовка
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {modalCategory.prep}
                  </p>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <Button
                  onClick={() => {
                    setModalService(null);
                    if (modalCategory) onBookService(modalCategory.id, modalIdx);
                  }}
                  className="flex-1 bg-gold-gradient hover:shadow-gold-glow text-background hover:bg-primary border border-primary rounded-sm min-w-[180px]"
                >
                  Записаться на эту услугу
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => setModalService(null)}
                  variant="ghost"
                  className="border border-border text-muted-foreground hover:text-primary hover:border-primary rounded-sm min-w-[180px]"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
