# 🚀 Развёртывание на Timeweb Cloud

Подробное руководство по запуску сайта «Школа Ланы Князевой» на Timeweb Cloud Apps.

---

## 📋 Что нужно подготовить

| Что | Где взять |
|-----|----------|
| GitHub-репозиторий | https://github.com/benidictns-collab/lanaknyzeva |
| Telegram BOT_TOKEN | у [@BotFather](https://t.me/BotFather) — уже есть: `8627243707:...` |
| Telegram CHAT_ID | у [@userinfobot](https://t.me/userinfobot) — уже есть: `5462119985` |
| Аккаунт Timeweb Cloud | https://timeweb.cloud |

---

## 🗂 Шаг 1. Создание приложения

1. Войдите в [панель Timeweb Cloud](https://timeweb.cloud/services)
2. Перейдите в раздел **«Apps»** → нажмите **«Создать»**
3. Выберите способ: **«Deploy from GitHub»**
4. Авторизуйте Timeweb в GitHub (если ещё не сделано) и выберите репозиторий:
   ```
   benidictns-collab/lanaknyzeva
   ```
5. Ветка: **`main`**

---

## ⚙️ Шаг 2. Настройка сборки

Timeweb Cloud определит Next.js автоматически, но проверьте поля:

| Поле | Значение |
|------|----------|
| **Build command** | `npm run build` (или `bun run build`) |
| **Start command** | `npm start` |
| **Port** | `3000` |
| **Health check path** | `/api/health` |

> ℹ️ Если Timeweb Cloud позволяет выбрать Node.js-окружение — выберите **Node.js 20**.

---

## 🔑 Шаг 3. Переменные окружения (КРИТИЧЕСКИ ВАЖНО)

Без них контейнер будет перезапускаться. Перейдите в раздел **«Variables»** или **«Переменные окружения»** и добавьте 3 переменные:

| Имя переменной | Значение | Обязательно? |
|----------------|----------|--------------|
| `DATABASE_URL` | `file:./db/custom.db` | ✅ Да |
| `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` | `8627243707:AAF3D1xRR-ayeP3Yq2YkUoWfBbjIopzFp_4` | ❌ Опционально (без него не будут отправляться уведомления в Telegram) |
| `NEXT_PUBLIC_TELEGRAM_CHAT_ID` | `5462119985` | ❌ Опционально |
| `PORT` | `3000` | ❌ По умолчанию платформа задаёт сама |

> ⚠️ **Важно**: `NEXT_PUBLIC_` в начале имени — это не ошибка. Next.js требует такой префикс для переменных, которые используются в браузере (Telegram-уведомления отправляются из клиентского кода).

---

## 🚀 Шаг 4. Запуск

1. Нажмите **«Deploy»** или **«Создать приложение»**
2. Дождитесь сборки (обычно 2–4 минуты)
3. В логах вы должны увидеть:
   ```
   [start] PORT = 3000
   [start] Running prisma db push...
   [start] prisma db push completed successfully
   [start] Starting Next.js on port 3000...
   ✓ Ready in 470ms
   ```
4. Когда статус сменится на **«Running»** (или зелёный) — приложение доступно по выданному URL:
   ```
   https://lanaknyzeva-xxxx.timeweb.cloud
   ```

---

## 🧪 Шаг 5. Проверка

Откройте в браузере:

| URL | Что должны увидеть |
|-----|-------------------|
| `https://<ваш-домен>.timeweb.cloud/` | Главная страница сайта |
| `https://<ваш-домен>.timeweb.cloud/api/health` | `{"ok":true,"status":"healthy","timestamp":"..."}` |
| `https://<ваш-домен>.timeweb.cloud/#booking` | Форма записи — пройдите все 5 шагов |

После создания записи:
- ✅ Слот должен заблокироваться (попробуйте записаться на то же время — будет недоступно)
- ✅ В Telegram (если настроен токен) придёт уведомление

---

## 🐛 Если контейнер всё ещё перезапускается

### Проверьте логи
1. В панели Timeweb Cloud откройте **«Logs»** / **«Логи»**
2. Ищите последние строки — там будет реальная ошибка

### Частые проблемы и решения

#### 1. `Cannot find module '.next'`
**Причина**: Build не завершился успешно или `.next` не попал в финальный образ.

**Решение**: Проверьте, что build command = `npm run build` и в логах сборки есть строка:
```
✓ Compiled successfully
```

#### 2. `PrismaClientInitializationError: Database URL not set`
**Причина**: Не задана переменная `DATABASE_URL`.

**Решение**: Добавьте в Variables: `DATABASE_URL = file:./db/custom.db`

#### 3. `EACCES: permission denied, mkdir '/app/db'`
**Причина**: У процесса нет прав на запись в директорию БД.

**Решение**: Используйте Docker-режим (см. ниже) или добавьте в Variables:
```
DATABASE_URL = file:/tmp/custom.db
```

#### 4. Health check fails (статус Unhealthy)
**Причина**: Порт приложения не совпадает с портом, который проверяет платформа.

**Решение**:
- В **Settings** приложения проверьте, что **Port = 3000**
- Либо задайте переменную `PORT` явно

#### 5. `next: not found`
**Причина**: `devDependencies` не установлены (на некоторых платформах `npm ci --production` пропускает их).

**Решение**: Убедитесь, что `next` в `dependencies`, а не в `devDependencies`. В нашем `package.json` это уже так.

---

## 🐳 Альтернатива: развёртывание через Docker

Если в панели Timeweb Cloud выбрать **«Docker»** вместо **«GitHub»**, можно использовать готовый `Dockerfile` из репозитория:

1. Создайте приложение → выберите **«Docker image»**
2. Укажите источник: **«From Dockerfile in repository»**
3. Путь к Dockerfile: `/Dockerfile`
4. Port: `3000`
5. Добавьте те же переменные окружения (Шаг 3)
6. Deploy

Преимущества Docker-режима:
- ✅ Воспроизводимое окружение (всегда Node.js 20 Alpine)
- ✅ HEALTHCHECK уже встроен в Dockerfile
- ✅ Меньше сюрпризов с зависимостями

---

## 🔄 Обновление приложения

При пуше в `main` Timeweb Cloud автоматически пересоберёт и задеплоит приложение. Чтобы обновить:
```bash
git add .
git commit -m "your changes"
git push origin main
```

---

## 💾 Про SQLite и постоянство данных

⚠️ **Важно**: SQLite хранится в файле `db/custom.db` внутри контейнера. При пересоздании контейнера (новый deploy) данные могут потеряться.

**Для продакшена рекомендуется**:
1. Использовать постоянный том (Persistent Volume) для директории `/app/db` — настройте в панели Timeweb Cloud
2. Либо подключить внешнюю БД (PostgreSQL/MySQL) — тогда:
   - Измените `DATABASE_URL` на `postgresql://...` или `mysql://...`
   - Измените `provider` в `prisma/schema.prisma` с `sqlite` на `postgresql` или `mysql`
   - Запустите `bun run db:push` локально для применения схемы

---

## 📞 Поддержка

- **Telegram-бот не шлёт уведомления?** → Проверьте, что получатель отправил боту `/start`
- **Слоты не блокируются?** → Проверьте `DATABASE_URL` и логи на ошибки Prisma
- **Белый экран?** → Откройте DevTools браузера → Console, ищите ошибки клиентского кода

Для дополнительных вопросов — обращайтесь в поддержку Timeweb Cloud через чат в панели управления.
