import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    { ok: false, error: 'Актуальное расписание доступно в форме YCLIENTS.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}
