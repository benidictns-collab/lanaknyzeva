'use client';

import { motion } from 'framer-motion';
import { Send, MessageCircle, Instagram, Phone, Clock, MapPin } from 'lucide-react';

export function Contacts() {
  return (
    <section
      id="contacts"
      className="py-20 lg:py-32 bg-card border-t border-border"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="eyebrow">Контакты</span>
          <h2 className="font-serif-display font-normal text-3xl md:text-[3.4rem] leading-[1.15] tracking-tight mt-5">
            Где нас <em className="italic text-primary font-medium">найти</em>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-stretch">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="pb-5 border-b border-border">
              <div className="flex items-center gap-2 text-primary mb-2.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[0.7rem] tracking-[0.22em] uppercase">Адрес клиники</span>
              </div>
              <p className="font-serif-display text-xl lg:text-2xl text-foreground leading-snug">
                г. Ростов-на-Дону,
                <br />
                ул. Социалистическая, 140
              </p>
              <p className="text-sm text-muted-foreground mt-1.5">Бесплатная парковка для гостей</p>
            </div>
            <div className="pb-5 border-b border-border">
              <div className="flex items-center gap-2 text-primary mb-2.5">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-[0.7rem] tracking-[0.22em] uppercase">Телефон</span>
              </div>
              <a
                href="tel:+79885350637"
                className="font-serif-display text-xl lg:text-2xl text-foreground hover:text-primary transition-colors"
              >
                +7 988 535-06-37
              </a>
              <p className="text-sm text-muted-foreground mt-1.5">Звонки принимаем ежедневно</p>
            </div>
            <div className="pb-5 border-b border-border">
              <div className="flex items-center gap-2 text-primary mb-2.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[0.7rem] tracking-[0.22em] uppercase">Режим работы</span>
              </div>
              <p className="font-serif-display text-xl lg:text-2xl text-foreground">
                Ежедневно, 09:00 — 21:00
              </p>
              <p className="text-sm text-muted-foreground mt-1.5">
                Онлайн-поддержка гостей — круглосуточно
              </p>
            </div>
            <div>
              <div className="text-[0.7rem] tracking-[0.22em] uppercase text-primary mb-3.5">
                Мессенджеры
              </div>
              <div className="flex gap-2.5">
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-11 h-11 border border-border rounded-full grid place-items-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/79885350637"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-11 h-11 border border-border rounded-full grid place-items-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 border border-border rounded-full grid place-items-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="border border-border rounded-sm overflow-hidden min-h-[420px] relative"
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=39.726%2C47.231&z=15&pt=39.726%2C47.231%2Cpm2rdm"
              title="Карта расположения клиники LANA KNYAZEVA"
              loading="lazy"
              className="w-full h-full border-0 min-h-[420px]"
              style={{
                filter: 'grayscale(0.4) invert(0.92) hue-rotate(180deg) contrast(0.85)',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border pt-16 lg:pt-20 pb-7">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 lg:gap-10 pb-12 border-b border-border">
          <div>
            <img
              src="/logo.png"
              alt="LANA KNYAZEVA"
              className="h-14 lg:h-16 w-auto mb-5 drop-shadow-[0_2px_12px_rgba(201,162,39,0.18)]"
            />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Премиальная клиника и школа эстетической косметологии в Ростове-на-Дону.
              Инъекционные и аппаратные методики, индивидуальный протокол для каждого гостя.
            </p>
          </div>
          <div>
            <h5 className="text-[0.74rem] tracking-[0.22em] uppercase text-primary mb-5 font-medium">
              Навигация
            </h5>
            <ul className="flex flex-col gap-3">
              {[
                { href: '#about', label: 'О клинике' },
                { href: '#services', label: 'Услуги' },
                { href: '#booking', label: 'Запись' },
                { href: '#reviews', label: 'Отзывы' },
                { href: '#contacts', label: 'Контакты' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[0.74rem] tracking-[0.22em] uppercase text-primary mb-5 font-medium">
              Направления
            </h5>
            <ul className="flex flex-col gap-3">
              {[
                'Эстетическая косметология',
                'Лазерная эпиляция',
                'Мезотерапия',
                'Биоревитализация',
                'Контурная пластика',
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[0.74rem] tracking-[0.22em] uppercase text-primary mb-5 font-medium">
              Контакты
            </h5>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="tel:+79885350637" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +7 988 535-06-37
                </a>
              </li>
              <li>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://wa.me/79885350637" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#contacts"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Ростов-на-Дону, Социалистическая 140
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 gap-4">
          <p className="text-xs text-muted-foreground/70">
            © 2026 LANA KNYAZEVA. Все права защищены.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="#privacy" className="text-xs text-muted-foreground/70 hover:text-primary transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#terms" className="text-xs text-muted-foreground/70 hover:text-primary transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
