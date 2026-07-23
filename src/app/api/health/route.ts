import { NextResponse } from 'next/server';

/**
 * Health check endpoint для Timeweb Cloud / любого балансировщика.
 * Возвращает 200 OK если приложение живо.
 *
 * Используется платформой для определения, готов ли контейнер принимать трафик.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
