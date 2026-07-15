import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/bookings/taken?date=YYYY-MM-DD&specialist=...
// Возвращает массив занятых временных слотов для указанной даты (и опционально специалиста)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const specialist = searchParams.get('specialist');

    if (!date) {
      return NextResponse.json(
        { ok: false, error: 'date is required (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Валидация формата даты
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { ok: false, error: 'invalid date format, expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const where: { date: string; status?: string; specialist?: string } = {
      date,
      status: 'confirmed',
    };
    if (specialist) where.specialist = specialist;

    const bookings = await db.booking.findMany({
      where,
      select: { time: true, specialist: true },
    });

    const takenSlots = bookings.map((b) => b.time);

    return NextResponse.json({
      ok: true,
      date,
      taken: takenSlots,
      count: takenSlots.length,
    });
  } catch (err) {
    console.error('[API /bookings/taken] error:', err);
    return NextResponse.json(
      { ok: false, error: 'internal server error' },
      { status: 500 }
    );
  }
}
