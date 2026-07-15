# LANA KNYAZEVA — Premium Beauty Clinic

Премиальный сайт клиники и школы эстетической косметологии LANA KNYAZEVA.
Полностью переписан на Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion.

## Технологии

| Слой | Технология |
|------|-----------|
| Фреймворк | Next.js 16 (App Router, Turbopack) |
| Язык | TypeScript 5 |
| UI | shadcn/ui (New York) + Lucide icons |
| Стили | Tailwind CSS 4 |
| Анимации | **framer-motion** + **motion** |
| Шрифты | Playfair Display (serif headings) + Marcellus (display) + Geist Sans (body) |

## Структура

```
src/
├── app/
│   ├── layout.tsx          # Root layout с шрифтами и SEO-мета
│   ├── page.tsx            # Главная страница (собирает все секции)
│   └── globals.css         # Tailwind тема + премиальная чёрно-золотая палитра
├── components/
│   ├── ui/                 # shadcn/ui компоненты
│   └── site/               # Компоненты сайта
│       ├── site-header.tsx     # Sticky header + бургер-меню с framer-motion
│       ├── hero.tsx            # Hero-секция со staggered animations
│       ├── about.tsx           # О клинике + Marquee
│       ├── services.tsx        # Каталог с табами + модальное окно
│       ├── booking.tsx         # 5-шаговая форма + Telegram уведомления
│       ├── promo.tsx           # Промо-блок «Счастливый клиентский день»
│       ├── reviews.tsx         # Отзывы с scroll-reveal
│       └── contacts-footer.tsx # Контакты + карта + footer
└── lib/
    └── site/
        └── data.ts         # CATEGORIES, SERVICES, SPECIALISTS, REVIEWS, TELEGRAM_CONFIG
```

## Премиальный дизайн (по SKILL ui-ux-pro-max)

### Палитра
- Фон: `#0A0A0A` / `#121212` (deep black)
- Текст: `#F5F0E6` (ivory)
- Акцент: `#C9A227` / `#D4AF37` (gold gradient)
- Разделители: `#2A2A2A`

### Типографика
- **Заголовки**: Playfair Display (serif, italic для акцентов)
- **Дисплей**: Marcellus
- **Body**: Geist Sans (light weight 300, letter-spacing 0.01em)

### UX-принципы (из SKILL файла)
- ✅ **Accessibility**: семантический HTML, aria-labels, keyboard nav (Enter/Space на карточках), focus-visible с золотым ring
- ✅ **Touch targets**: все интерактивные элементы ≥ 44px (кнопки, пункты меню, слоты времени)
- ✅ **Animation timing**: 150–500ms с `cubic-bezier(0.22, 1, 0.36, 1)`, exit быстрее enter
- ✅ **Reduced motion**: `@media (prefers-reduced-motion: reduce)` отключает анимации
- ✅ **Dark mode pairing**: дизайн изначально тёмный, контраст ≥ 4.5:1
- ✅ **State clarity**: hover/active/disabled состояния визуально различимы
- ✅ **Modal motion**: scale+fade, backdrop blur, закрытие по Escape и клику на overlay
- ✅ **Stagger sequence**: 0.04–0.12s задержка между элементами в списках
- ✅ **Touch spacing**: 8–16px gap между интерактивными элементами

## Анимации (framer-motion)

- **Hero**: staggered вход элементов с задержкой 0.12s
- **Cards**: `whileHover={{ y: -4 }}` для тонкого подъёма
- **Modal**: scale + fade через `AnimatePresence`
- **Mobile menu**: slide-in с overlay fade
- **Stats**: последовательное появление с 0.1s задержкой
- **Steps indicator**: анимированный прогресс-бар

## Функционал формы записи

1. **5 шагов**: Категория → Услуга → Специалист → Дата/Время → Контакты → Подтверждение
2. **Валидация**: имя, телефон (маска +7), consent checkbox — на каждом шаге
3. **Telegram уведомление**: отправка заявки в @lanaknyazevaschool через Bot API
4. **Toast feedback**: показ статуса отправки
5. **Спиннер на кнопке** при отправке

## Настройка Telegram

1. Создайте бота через @BotFather → получите `BOT_TOKEN`
2. Пользователь @lanaknyazevaschool должен отправить боту `/start`
3. Узнайте chat_id (например через @username_to_id_bot)
4. Отредактируйте `src/lib/site/data.ts`:
```ts
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '7123456789:AAH-xyz...',
  CHAT_ID: '123456789',
  ENABLED: true,
};
```

## Запуск

Dev сервер запускается автоматически:
```bash
bun run dev    # → http://localhost:3000
bun run lint   # проверка кода
```

## Логотип

`public/logo.png` — золотой пятиугольник с монограммой «LK» и текстом LANA KNYAZEVA.

---

© 2026 LANA KNYAZEVA · Aesthetic Clinic
