import { NextResponse } from 'next/server';

// Retire the independent booking database endpoint. Existing records are preserved,
// but stale clients must not create appointments outside the YCLIENTS schedule.
function retired() {
  return NextResponse.json(
    { ok: false, error: 'Запись перенесена в YCLIENTS. Обновите страницу сайта.', bookingUrl: 'https://n2289117.yclients.ru/' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}

export const GET = retired;
export const POST = retired;
