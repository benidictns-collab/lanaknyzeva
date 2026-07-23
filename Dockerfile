# =====================================================================
# Dockerfile для Школы Ланы Князевой
# Используется на платформах, поддерживающих Docker (Timeweb Cloud,
# Render, Railway, Fly.io, любой Kubernetes).
#
# Локальная проверка:
#   docker build -t lanaknyzeva .
#   docker run -p 3000:3000 -e NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=... \
#     -e NEXT_PUBLIC_TELEGRAM_CHAT_ID=... lanaknyzeva
# =====================================================================

# ---- Stage 1: deps ----
FROM node:20-alpine AS deps
WORKDIR /app

# Копируем манифесты для кэширования слоя
COPY package.json bun.lock* package-lock.json* yarn.lock* ./
COPY prisma ./prisma

# Устанавливаем зависимости (используем npm — он есть в node:20-alpine)
RUN npm ci --omit=optional || npm install --omit=optional

# ---- Stage 2: build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Env по умолчанию для сборки (NEXT_PUBLIC_* вшиваются в бандл)
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./db/custom.db"

# Сборка Next.js + генерация Prisma Client
RUN npx prisma generate && npm run build

# ---- Stage 3: runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV DATABASE_URL="file:./db/custom.db"

# Минимальный набор файлов для prod
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.ts ./next.config.ts

# Создаём директорию для SQLite (writable volume)
RUN mkdir -p /app/db

EXPOSE 3000

# Healthcheck: проверяем /api/health каждые 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-3000}/api/health || exit 1

# Используем тот же start.mjs, что и для npm start
CMD ["node", "scripts/start.mjs"]
