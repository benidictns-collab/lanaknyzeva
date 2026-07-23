# Школа Ланы Князевой — Premium Beauty Clinic & School

Премиальный сайт клиники и школы эстетической косметологии.
Построен на Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion.

## 🚀 Возможности

- **Премиальный чёрно-золотой дизайн** с анимациями Framer Motion
- **Каталог из 9 направлений** с 60+ процедурами и модальными окнами деталей
- **Полноценная форма записи** (5 шагов: категория → услуга → специалист → дата/время → контакты)
- **Реальная синхронизация слотов** через SQLite — занятое время мгновенно блокируется для других
- **Telegram-уведомления** о новых заявках через Bot API
- **Адаптивный дизайн** (mobile-first, бургер-меню, touch-friendly)
- **SEO-оптимизация** — мета-теги, Open Graph, семантическая вёрстка

## 🛠 Технологии

| Слой | Технология |
|------|-----------|
| Фреймворк | Next.js 16 (App Router, Turbopack) |
| Язык | TypeScript 5 |
| UI | shadcn/ui (New York) + Lucide icons |
| Стили | Tailwind CSS 4 |
| Анимации | framer-motion + motion |
| База данных | Prisma ORM + SQLite |
| Шрифты | Playfair Display + Marcellus + Geist Sans |

## 📦 Установка

```bash
# 1. Установить зависимости
bun install

# 2. Создать файл .env.local со следующими переменными:
cat > .env.local << 'EOF'
DATABASE_URL=file:./db/custom.db
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=<ваш_бот_токен_от_BotFather>
NEXT_PUBLIC_TELEGRAM_CHAT_ID=<chat_id_получателя>
EOF

# 3. Применить схему базы данных
bun run db:push

# 4. Запустить dev-сервер
bun run dev
```

Откройте http://localhost:3000 в браузере.

## 🔑 Получение Telegram chat_id

1. Создайте бота через [@BotFather](https://t.me/BotFather) → получите `BOT_TOKEN`
2. Откройте вашего бота в Telegram и отправьте `/start`
3. Узнайте свой `chat_id` через [@userinfobot](https://t.me/userinfobot) или другим способом
4. Вставьте значения в `.env.local`

## 📁 Структура проекта

```
src/
├── app/
│   ├── layout.tsx              # Root layout: шрифты + SEO-мета
│   ├── page.tsx                # Главная страница
│   ├── globals.css             # Tailwind тема: премиальная чёрно-золотая палитра
│   └── api/
│       └── bookings/
│           ├── route.ts        # POST /api/bookings (создание записи)
│           └── taken/
│               └── route.ts    # GET /api/bookings/taken (занятые слоты)
├── components/
│   ├── ui/                     # shadcn/ui компоненты
│   └── site/                   # Компоненты сайта
│       ├── site-header.tsx     # Sticky header + бургер-меню
│       ├── hero.tsx            # Hero с staggered animations
│       ├── about.tsx           # О клинике + Marquee
│       ├── services.tsx        # Каталог с табами + модалки
│       ├── booking.tsx         # 5-шаговая форма записи
│       ├── promo.tsx           # Промо-блок «Счастливый клиентский день»
│       ├── reviews.tsx         # Отзывы
│       └── contacts-footer.tsx # Контакты + карта + footer
├── lib/
│   ├── db.ts                   # Prisma client
│   └── site/
│       └── data.ts             # Категории, услуги, специалисты, отзывы
└── prisma/
    └── schema.prisma           # Модель Booking + User + Post
```

## 💾 Схема базы данных

```prisma
model Booking {
  id          String   @id @default(cuid())
  name        String
  phone       String
  comment     String   @default("")
  service     String
  category    String
  duration    String
  price       String
  specialist  String?
  date        String   // YYYY-MM-DD
  time        String   // HH:mm
  status      String   @default("confirmed")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([date, time, specialist]) // атомарная защита от двойного бронирования
  @@index([date])
}
```

## 🔒 Безопасность

- Все секреты (BOT_TOKEN, CHAT_ID, DATABASE_URL) хранятся в `.env.local` (не коммитится)
- Server-side валидация всех полей в API endpoints
- Защита от двойного бронирования через `@@unique` constraint в Prisma
- Проверка что дата не в прошлом при создании записи

## 📝 Лицензия

© 2026 Школа Ланы Князевой. Все права защищены.

---

## ☁️ Развёртывание на Timeweb Cloud (краткая версия)

Подробное руководство — в [DEPLOY.md](./DEPLOY.md).

### Быстрые шаги:

1. **Создайте App** на [Timeweb Cloud](https://timeweb.cloud/services) → Deploy from GitHub → выберите `benidictns-collab/lanaknyzeva`, ветка `main`

2. **Build command**: `npm run build`
3. **Start command**: `npm start`
4. **Port**: `3000`
5. **Health check path**: `/api/health`

6. **Добавьте переменные окружения** (обязательно!):

| Имя | Значение |
|-----|----------|
| `DATABASE_URL` | `file:./db/custom.db` |
| `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` | `8627243707:AAF3D1xRR-ayeP3Yq2YkUoWfBbjIopzFp_4` |
| `NEXT_PUBLIC_TELEGRAM_CHAT_ID` | `5462119985` |

7. **Deploy** → дождитесь статуса Running → откройте выданный URL.

### Альтернатива через Docker

В панели Timeweb Cloud выберите **Docker** вместо GitHub — в репозитории уже есть готовый `Dockerfile` с встроенным healthcheck. Те же переменные окружения нужно задать.

### Что делает `npm start`?

Скрипт [`scripts/start.mjs`](./scripts/start.mjs) автоматически:
1. Читает `PORT` из env (Timeweb Cloud задаёт автоматически)
2. Создаёт директорию `db/` если её нет
3. Запускает `prisma db push` для инициализации схемы БД
4. Запускает `next start` на нужном порту

Это решает проблему с перезапуском контейнера, когда БД не инициализирована.
