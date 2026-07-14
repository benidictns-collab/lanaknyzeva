'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CATEGORIES,
  SERVICES,
  SPECIALISTS,
  TELEGRAM_CONFIG,
  type Service,
  type Category,
  type Specialist,
} from '@/lib/site/data';

type BookingState = {
  step: number;
  category: string | null;
  service: Service | null;
  specialist: Specialist | null;
  date: Date | null;
  time: string | null;
  name: string;
  phone: string;
  comment: string;
  consent: boolean;
};

const STEPS = [
  { num: 1, label: 'Категория' },
  { num: 2, label: 'Услуга' },
  { num: 3, label: 'Специалист' },
  { num: 4, label: 'Дата и время' },
  { num: 5, label: 'Контакты' },
];

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const DOWS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

function plural(n: number, forms: [string, string, string]) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
}

function formatTelegramMessage(p: {
  name: string;
  phone: string;
  comment: string;
  service: Service | null;
  category: Category | null;
  specialist: Specialist | null;
  date: Date | null;
  time: string | null;
}) {
  const dateStr = p.date
    ? p.date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      })
    : '—';
  const lines = [
    '🔔 <b>Новая заявка с сайта</b>',
    '🏠 <b>LANA KNYAZEVA</b> · Aesthetic Clinic',
    '━━━━━━━━━━━━━━━',
    '',
    `👤 <b>Клиент:</b> ${escapeHtml(p.name)}`,
    `📞 <b>Телефон:</b> <code>${escapeHtml(p.phone)}</code>`,
    '',
    p.service ? `💼 <b>Услуга:</b> ${escapeHtml(p.service.name)}` : null,
    p.category ? `🏷 <b>Категория:</b> ${escapeHtml(p.category.name)}` : null,
    p.service ? `⏱ <b>Длительность:</b> ${escapeHtml(p.service.dur)}` : null,
    p.service ? `💰 <b>Стоимость:</b> ${escapeHtml(p.service.price)}` : null,
    '',
    p.specialist
      ? `👩‍⚕️ <b>Специалист:</b> ${escapeHtml(p.specialist.name)} (${p.specialist.role})`
      : null,
    `📅 <b>Дата:</b> ${escapeHtml(dateStr)}`,
    `🕐 <b>Время:</b> ${escapeHtml(p.time || '—')}`,
    '',
    p.comment ? `💬 <b>Комментарий:</b>\n<i>${escapeHtml(p.comment)}</i>` : null,
    '',
    '━━━━━━━━━━━━━━━',
    `🕐 Получено: ${new Date().toLocaleString('ru-RU')}`,
  ].filter(Boolean);
  return lines.join('\n');
}

function escapeHtml(str: string | null | undefined) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramNotification(payload: {
  name: string;
  phone: string;
  comment: string;
  service: Service | null;
  category: Category | null;
  specialist: Specialist | null;
  date: Date | null;
  time: string | null;
}) {
  if (!TELEGRAM_CONFIG.ENABLED) {
    return { ok: true, skipped: true };
  }
  if (
    !TELEGRAM_CONFIG.BOT_TOKEN ||
    TELEGRAM_CONFIG.BOT_TOKEN === 'PASTE_YOUR_BOT_TOKEN_HERE'
  ) {
    console.warn('[Telegram] BOT_TOKEN not configured');
    return { ok: false, error: 'BOT_TOKEN not configured' };
  }
  const text = formatTelegramMessage(payload);
  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await resp.json();
    if (!data.ok) {
      console.error('[Telegram] Error:', data.description);
      return { ok: false, error: data.description };
    }
    return { ok: true };
  } catch (err) {
    console.error('[Telegram] Network error:', err);
    return { ok: false, error: String(err) };
  }
}

type BookingProps = {
  preselect: { catId: string; idx: number } | null;
  onConsumePreselect: () => void;
};

export function Booking({ preselect, onConsumePreselect }: BookingProps) {
  const [state, setState] = useState<BookingState>({
    step: 1,
    category: null,
    service: null,
    specialist: null,
    date: null,
    time: null,
    name: '',
    phone: '',
    comment: '',
    consent: false,
  });
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; consent?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Handle preselect from services section
  if (preselect) {
    setState((s) => ({
      ...s,
      category: preselect.catId,
      service: SERVICES[preselect.catId]?.[preselect.idx] || null,
      step: 2,
    }));
    onConsumePreselect();
  }

  const update = (patch: Partial<BookingState>) => setState((s) => ({ ...s, ...patch }));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const nextStep = async () => {
    if (state.step === 1 && !state.category) {
      showToast('Выберите направление');
      return;
    }
    if (state.step === 2 && !state.service) {
      showToast('Выберите услугу');
      return;
    }
    if (state.step === 3 && !state.specialist) {
      showToast('Выберите специалиста');
      return;
    }
    if (state.step === 4 && (!state.date || !state.time)) {
      showToast('Выберите дату и время');
      return;
    }
    if (state.step === 5) {
      const newErrors: typeof errors = {};
      if (!state.name.trim()) newErrors.name = true;
      if (!isValidPhone(state.phone)) newErrors.phone = true;
      if (!state.consent) newErrors.consent = true;
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      setSubmitting(true);
      const cat = state.category ? CATEGORIES.find((c) => c.id === state.category) : null;
      const tgResult = await sendTelegramNotification({
        name: state.name,
        phone: state.phone,
        comment: state.comment,
        service: state.service,
        category: cat || null,
        specialist: state.specialist,
        date: state.date,
        time: state.time,
      });
      setSubmitting(false);

      if (tgResult.skipped) showToast('Заявка принята (уведомления выключены)');
      else if (tgResult.ok) showToast('Заявка отправлена в Telegram ✓');
      else showToast('Заявка принята. Telegram временно недоступен.');

      update({ step: 6 });
      setTimeout(() => {
        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }
    if (state.step < 5) update({ step: state.step + 1 });
  };

  const prevStep = () => {
    if (state.step > 1) update({ step: state.step - 1 });
  };

  const resetBooking = () => {
    setState({
      step: 1,
      category: null,
      service: null,
      specialist: null,
      date: null,
      time: null,
      name: '',
      phone: '',
      comment: '',
      consent: false,
    });
    setErrors({});
  };

  const phoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7') && v.length > 0) v = '7' + v;
    v = v.slice(0, 11);
    let out = '+7';
    if (v.length > 1) out += ' (' + v.slice(1, 4);
    if (v.length >= 4) out += ') ' + v.slice(4, 7);
    if (v.length >= 7) out += '-' + v.slice(7, 9);
    if (v.length >= 9) out += '-' + v.slice(9, 11);
    update({ phone: out });
  };

  // Calendar render
  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
  const lastDay = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastMonth =
    calMonth.getFullYear() < today.getFullYear() ||
    (calMonth.getFullYear() === today.getFullYear() && calMonth.getMonth() < today.getMonth());

  const progress = (state.step - 1) / 5;
  const cat = state.category ? CATEGORIES.find((c) => c.id === state.category) : null;
  const dateStr = state.date
    ? state.date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <section id="booking" className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background to-[#0D0A07]">
      <div
        className="absolute -top-1/2 -right-10 w-3/5 h-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 60%)' }}
      />
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-[clamp(20px,5vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="eyebrow center inline-flex">Запись на приём</span>
          <h2 className="font-serif-display font-normal text-3xl md:text-[3.4rem] leading-[1.15] tracking-tight mt-5">
            Выберите время, <em className="italic text-primary font-medium">которое удобно вам</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Четыре шага — и протокол подобран. Мы свяжемся для подтверждения в течение
            пятнадцати минут.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl mx-auto bg-card border border-border rounded-md p-7 md:p-12 relative"
        >
          {/* Steps indicator */}
          <div className="flex justify-between mb-11 relative">
            <div className="absolute top-4 left-4 right-4 h-px bg-border z-0" />
            <motion.div
              className="absolute top-4 left-4 h-px bg-primary z-10"
              animate={{ width: `calc((100% - 32px) * ${progress})` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            {STEPS.map((step) => {
              const isActive = step.num === state.step;
              const isDone = step.num < state.step;
              return (
                <div
                  key={step.num}
                  className={`relative z-20 flex flex-col items-center gap-2 flex-1 ${
                    isActive || isDone ? '' : 'opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full grid place-items-center text-xs font-medium border transition-all duration-300 ${
                      isActive
                        ? 'bg-primary border-primary text-background'
                        : isDone
                        ? 'bg-card border-primary text-primary'
                        : 'bg-card border-border text-muted-foreground/60'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[0.66rem] tracking-[0.16em] uppercase text-center ${
                      isActive || isDone ? 'text-foreground' : 'text-muted-foreground/60'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Categories */}
            {state.step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-serif-display text-2xl font-medium text-foreground mb-2">
                  Выберите направление
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Девять категорий услуг — от эстетической косметологии до коллагенотерапии.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((c) => {
                    const count = (SERVICES[c.id] || []).length;
                    const selected = state.category === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => update({ category: c.id, service: null })}
                        className={`p-4 border rounded-sm text-left transition-all duration-300 flex flex-col gap-1.5 ${
                          selected
                            ? 'bg-gradient-to-br from-primary/12 to-primary/4 border-primary'
                            : 'bg-background border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-primary text-base font-serif-display">
                          {count} {plural(count, ['услуга', 'услуги', 'услуг'])}
                        </span>
                        <span className="font-serif-display text-sm text-foreground font-medium leading-snug">
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Service */}
            {state.step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-serif-display text-2xl font-medium text-foreground mb-2">
                  Выберите услугу
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Категория: {cat?.name}. Выберите нужную процедуру.
                </p>
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2">
                  {(SERVICES[state.category!] || []).map((svc, i) => {
                    const selected = state.service?.name === svc.name;
                    return (
                      <div
                        key={svc.name}
                        onClick={() => update({ service: svc })}
                        className={`flex items-center justify-between gap-4 p-4 border rounded-sm cursor-pointer transition-all min-w-0 ${
                          selected
                            ? 'bg-gradient-to-br from-primary/12 to-primary/4 border-primary'
                            : 'bg-background border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-serif-display text-base text-foreground mb-1 break-words">
                            {svc.name}
                          </div>
                          <div className="text-xs text-muted-foreground/70 tracking-wide">
                            {svc.dur} · {cat?.name}
                          </div>
                        </div>
                        <div className="font-serif-display text-lg text-primary font-medium whitespace-nowrap">
                          {svc.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Specialist */}
            {state.step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-serif-display text-2xl font-medium text-foreground mb-2">
                  Выберите специалиста
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Каждый врач клиники имеет медицинское образование и регулярную переподготовку.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {SPECIALISTS.map((spec) => {
                    const selected = state.specialist?.id === spec.id;
                    return (
                      <div
                        key={spec.id}
                        onClick={() => update({ specialist: spec })}
                        className={`bg-background border rounded-sm p-5 text-center cursor-pointer transition-all hover:-translate-y-0.5 ${
                          selected
                            ? 'bg-gradient-to-br from-primary/12 to-primary/4 border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-full mx-auto mb-3.5 overflow-hidden border border-gold-soft bg-card">
                          <img
                            src={spec.img}
                            alt={spec.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-serif-display text-base text-foreground">
                          {spec.name}
                        </div>
                        <div className="text-xs text-primary tracking-wide mb-2.5 mt-1">
                          {spec.role}
                        </div>
                        <div className="text-xs text-muted-foreground/70 inline-flex items-center gap-1">
                          <Star className="w-3 h-3 text-primary fill-primary" />
                          {spec.rating}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Date & time */}
            {state.step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-serif-display text-2xl font-medium text-foreground mb-2">
                  Выберите дату и время
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Доступные слоты обновляются в реальном времени.
                </p>
                <div className="grid sm:grid-cols-2 gap-7">
                  {/* Calendar */}
                  <div className="bg-background border border-border rounded-sm p-4">
                    <div className="flex justify-between items-center mb-3.5">
                      <span className="font-serif-display text-base text-foreground">
                        {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            const d = new Date(calMonth);
                            d.setMonth(d.getMonth() - 1);
                            setCalMonth(d);
                          }}
                          disabled={isPastMonth}
                          className="w-7 h-7 border border-border rounded-sm grid place-items-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Предыдущий месяц"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const d = new Date(calMonth);
                            d.setMonth(d.getMonth() + 1);
                            setCalMonth(d);
                          }}
                          className="w-7 h-7 border border-border rounded-sm grid place-items-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                          aria-label="Следующий месяц"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {DOWS.map((d) => (
                        <div
                          key={d}
                          className="text-[0.64rem] text-center text-muted-foreground/70 tracking-wide py-1.5 uppercase"
                        >
                          {d}
                        </div>
                      ))}
                      {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`e${i}`} />
                      ))}
                      {Array.from({ length: lastDay.getDate() }).map((_, i) => {
                        const day = i + 1;
                        const dateObj = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
                        const isPast = dateObj < today;
                        const isToday = dateObj.toDateString() === today.toDateString();
                        const isSelected =
                          state.date && dateObj.toDateString() === state.date.toDateString();
                        return (
                          <button
                            key={day}
                            onClick={() => !isPast && update({ date: dateObj, time: null })}
                            disabled={isPast}
                            className={`aspect-square grid place-items-center text-sm rounded-sm border transition-all ${
                              isSelected
                                ? 'bg-primary text-background border-primary font-medium'
                                : isToday
                                ? 'text-primary border-transparent'
                                : isPast
                                ? 'text-muted-foreground/20 cursor-not-allowed border-transparent'
                                : 'text-muted-foreground border-transparent hover:border-primary/50 hover:text-foreground'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Time slots */}
                  <div className="bg-background border border-border rounded-sm p-4">
                    <div className="font-serif-display text-base text-foreground mb-3.5">
                      Доступное время
                    </div>
                    {state.date ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const seed = state.date!.getDate();
                          const disabled = (parseInt(slot) + seed) % 4 === 0;
                          const selected = state.time === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => !disabled && update({ time: slot })}
                              disabled={disabled}
                              className={`py-2.5 text-center text-sm border rounded-sm transition-all ${
                                selected
                                  ? 'bg-primary text-background border-primary'
                                  : disabled
                                  ? 'text-muted-foreground/20 cursor-not-allowed line-through border-transparent'
                                  : 'text-muted-foreground border-border hover:border-primary hover:text-foreground'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground/70 text-sm text-center py-5 italic">
                        Сначала выберите дату в календаре
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Contacts */}
            {state.step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-serif-display text-2xl font-medium text-foreground mb-2">
                  Контактные данные
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Проверьте итоговую сводку и заполните контакты для подтверждения записи.
                </p>
                <div className="bg-background border border-gold-soft rounded-sm p-5 mb-6">
                  <SummaryRow label="Услуга" value={state.service?.name} sub={cat?.name} />
                  <SummaryRow
                    label="Специалист"
                    value={state.specialist?.name}
                    sub={state.specialist?.role}
                  />
                  <SummaryRow label="Дата" value={dateStr} sub={state.time || '—'} />
                  <SummaryRow label="Длительность" value={state.service?.dur} />
                  <SummaryRow
                    label="Стоимость"
                    value={state.service?.price}
                    isPrice
                    last
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="fName" className="text-xs tracking-[0.16em] uppercase text-muted-foreground mb-2 block">
                      Имя *
                    </Label>
                    <Input
                      id="fName"
                      value={state.name}
                      onChange={(e) => {
                        update({ name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: false });
                      }}
                      placeholder="Как к вам обращаться"
                      className={`bg-background border-border rounded-sm ${
                        errors.name ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1.5">Поле обязательно для заполнения</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="fPhone" className="text-xs tracking-[0.16em] uppercase text-muted-foreground mb-2 block">
                      Телефон *
                    </Label>
                    <Input
                      id="fPhone"
                      type="tel"
                      inputMode="tel"
                      value={state.phone}
                      onChange={phoneMask}
                      placeholder="+7 (___) ___-__-__"
                      className={`bg-background border-border rounded-sm ${
                        errors.phone ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1.5">Введите корректный номер</p>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="fComment" className="text-xs tracking-[0.16em] uppercase text-muted-foreground mb-2 block">
                    Комментарий
                  </Label>
                  <Textarea
                    id="fComment"
                    value={state.comment}
                    onChange={(e) => update({ comment: e.target.value })}
                    placeholder="Особые пожелания, аллергии, противопоказания — расскажите подробнее"
                    className="bg-background border-border rounded-sm min-h-[90px] resize-y"
                  />
                </div>
                <div className="flex items-start gap-3 mb-2">
                  <Checkbox
                    id="fConsent"
                    checked={state.consent}
                    onCheckedChange={(checked) => {
                      update({ consent: checked === true });
                      if (errors.consent) setErrors({ ...errors, consent: false });
                    }}
                    className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="fConsent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    Я подтверждаю согласие на обработку персональных данных в соответствии с{' '}
                    <a href="#privacy" className="text-primary underline underline-offset-2">политикой конфиденциальности</a>
                    {' '}и принимаю условия{' '}
                    <a href="#terms" className="text-primary underline underline-offset-2">пользовательского соглашения</a>.
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-destructive mb-3">
                    Необходимо согласие на обработку данных
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 6: Success */}
            {state.step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-16 h-16 mx-auto mb-6 rounded-full border border-primary grid place-items-center text-primary"
                >
                  <Check className="w-8 h-8" />
                </motion.div>
                <h3 className="font-serif-display text-3xl text-foreground mb-2.5">
                  Запись подтверждена
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Мы свяжемся с вами в течение 15 минут для подтверждения.
                </p>
                <div className="bg-background border border-gold-soft rounded-sm p-5 text-left mb-6">
                  <SummaryRow label="Услуга" value={state.service?.name} sub={cat?.name} />
                  <SummaryRow
                    label="Специалист"
                    value={state.specialist?.name}
                    sub={state.specialist?.role}
                  />
                  <SummaryRow label="Дата" value={dateStr} sub={state.time || '—'} />
                  <SummaryRow label="Длительность" value={state.service?.dur} />
                  <SummaryRow label="Стоимость" value={state.service?.price} isPrice last />
                  {state.name && (
                    <SummaryRow
                      label="Клиент"
                      value={state.name}
                      sub={state.phone}
                      last
                    />
                  )}
                </div>
                <Button
                  onClick={resetBooking}
                  variant="ghost"
                  className="border border-border text-muted-foreground hover:text-primary hover:border-primary rounded-sm"
                >
                  Создать новую запись
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {state.step < 6 && (
            <div className="flex justify-between items-center mt-7 pt-6 border-t border-border gap-3">
              <Button
                onClick={prevStep}
                disabled={state.step === 1}
                variant="ghost"
                className="text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Назад
              </Button>
              <Button
                onClick={nextStep}
                disabled={submitting}
                className="bg-gold-gradient hover:shadow-gold-glow text-background hover:bg-primary border border-primary rounded-sm"
              >
                {submitting ? (
                  <>
                    Отправляем заявку…
                    <span className="ml-2 w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  </>
                ) : state.step === 5 ? (
                  <>
                    Подтвердить запись
                    <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Продолжить
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* TODO YCLIENTS placeholder */}
        {/*<script async src="https://w.yclients.com/p/widget.js" data-company-id="XXXXXX"></script>*/}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card text-foreground px-7 py-3.5 border border-primary rounded-sm text-sm tracking-wide z-[100]"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  sub,
  isPrice,
  last,
}: {
  label: string;
  value?: string | null;
  sub?: string | null;
  isPrice?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex justify-between items-start gap-3.5 py-3 ${last ? '' : 'border-b border-border'}`}>
      <span className="text-[0.72rem] tracking-[0.16em] uppercase text-muted-foreground/70 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <div className="text-right max-w-[70%] break-words">
        <div className={`font-serif-display ${isPrice ? 'text-primary text-xl' : 'text-foreground text-base'} leading-snug`}>
          {value || '—'}
        </div>
        {sub && (
          <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>
        )}
      </div>
    </div>
  );
}

function isValidPhone(v: string) {
  const digits = v.replace(/\D/g, '');
  return digits.length >= 11;
}
