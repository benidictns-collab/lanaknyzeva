#!/usr/bin/env node
/**
 * Production start script for Timeweb Cloud / any container platform.
 *
 * Что делает этот скрипт:
 * 1. Определяет порт (PORT env или 3000)
 * 2. Создаёт директорию для SQLite, если её нет
 * 3. Запускает `prisma db push` чтобы создать/мигрировать схему БД
 * 4. Запускает `next start` на нужном порту
 *
 * Использование Node.js вместо bash-скрипта гарантирует работу в любом контейнере
 * (Alpine, Debian, Ubuntu) без зависимости от shell-синтаксиса.
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 1. Определяем порт
const PORT = process.env.PORT || '3000';
console.log(`[start] PORT = ${PORT}`);

// 2. Гарантируем, что директория для SQLite существует
// DATABASE_URL имеет вид "file:./db/custom.db" — нужно создать ./db/
const dbDir = resolve(projectRoot, 'db');
if (!existsSync(dbDir)) {
  console.log(`[start] Creating db directory: ${dbDir}`);
  try {
    mkdirSync(dbDir, { recursive: true });
  } catch (err) {
    console.warn(`[start] Warning: could not create db dir: ${err.message}`);
  }
}

// 3. Запускаем prisma db push — создаёт/обновляет схему БД
console.log('[start] Running prisma db push...');
const prismaResult = spawnSync('npx', ['prisma', 'db', 'push', '--accept-data-loss'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env },
});

if (prismaResult.error) {
  console.error('[start] Failed to run prisma db push:', prismaResult.error.message);
  console.error('[start] Continuing anyway — app may fail if DB is required');
} else if (prismaResult.status !== 0) {
  console.warn(`[start] prisma db push exited with code ${prismaResult.status}`);
  console.warn('[start] Continuing anyway — DB might already be initialized');
} else {
  console.log('[start] prisma db push completed successfully');
}

// 4. Запускаем next start
console.log(`[start] Starting Next.js on port ${PORT}...`);
const child = spawn('npx', ['next', 'start', '-p', PORT], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env },
});

// Пробрасываем сигналы для корректной остановки
process.on('SIGTERM', () => {
  console.log('[start] SIGTERM received, stopping Next.js...');
  child.kill('SIGTERM');
});
process.on('SIGINT', () => {
  console.log('[start] SIGINT received, stopping Next.js...');
  child.kill('SIGINT');
});

child.on('error', (err) => {
  console.error('[start] Failed to start Next.js:', err.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log(`[start] Next.js exited with code ${code}${signal ? ` (signal ${signal})` : ''}`);
  process.exit(code ?? 1);
});
