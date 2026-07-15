import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/bookings
// Создаёт новую запись. Тело:
//   { name, phone, comment?, service, category, duration, price, specialist?, date (YYYY-MM-DD), time (HH:mm) }
//
// Server-side валидация:
//   - все обязательные поля заполнены
//   - формат даты YYYY-MM-DD и времени HH:mm
//   - телефон: ≥ 11 цифр
//   - слот на эту дату+время+специалиста не занят (атомарная проверка через unique constraint)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      comment = '',
      service,
      category,
      duration,
      price,
      specialist,
      date,
      time,
    } = body;

    // ---- Валидация ----
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Имя обязательно (минимум 2 символа)';
    }
    if (!phone || typeof phone !== 'string') {
      errors.phone = 'Телефон обязателен';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 11) errors.phone = 'Введите корректный номер';
    }
    if (!service || typeof service !== 'string') errors.service = 'Услуга обязательна';
    if (!category || typeof category !== 'string') errors.category = 'Категория обязательна';
    if (!duration || typeof duration !== 'string') errors.duration = 'Длительность обязательна';
    if (!price || typeof price !== 'string') errors.price = 'Цена обязательна';
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = 'Дата невалидна';
    if (!time || !/^\d{2}:\d{2}$/.test(time)) errors.time = 'Время невалидно';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, error: 'validation_failed', fieldErrors: errors },
        { status: 400 }
      );
    }

    // ---- Проверка что слот свободен ----
    // ВАЖНО: даже если две заявки придут одновременно, сработает @@unique constraint в схеме
    // и вторая получит ошибку — атомарная защита от двойного бронирования
    const existing = await db.booking.findFirst({
      where: {
        date,
        time,
        status: 'confirmed',
        ...(specialist ? { specialist } : {}),
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: 'slot_taken',
          message: 'К сожалению, это время только что было забронировано. Выберите другое.',
        },
        { status: 409 }
      );
    }

    // ---- Проверка что дата не в прошлом ----
    const bookingDate = new Date(`${date}T${time}:00`);
    if (isNaN(bookingDate.getTime()) || bookingDate < new Date()) {
      return NextResponse.json(
        { ok: false, error: 'past_date', message: 'Нельзя записаться на прошедшее время' },
        { status: 400 }
      );
    }

    // ---- Сохранение ----
    const booking = await db.booking.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        comment: typeof comment === 'string' ? comment.trim() : '',
        service,
        category,
        duration,
        price,
        specialist: specialist || null,
        date,
        time,
        status: 'confirmed',
      },
      select: {
        id: true,
        name: true,
        service: true,
        date: true,
        time: true,
        specialist: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        booking,
        message: 'Запись успешно создана',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[API /bookings POST] error:', err);

    // Prisma unique constraint violation (P2002) — слот уже занят
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'slot_taken',
          message: 'Это время только что забронировали. Пожалуйста, выберите другое.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'internal_server_error' },
      { status: 500 }
    );
  }
}

// GET /api/bookings — список всех записей (для админ-панели / отладки)
export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      where: { status: 'confirmed' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        service: true,
        category: true,
        specialist: true,
        date: true,
        time: true,
        price: true,
        createdAt: true,
      },
      take: 100,
    });
    return NextResponse.json({ ok: true, bookings, count: bookings.length });
  } catch (err) {
    console.error('[API /bookings GET] error:', err);
    return NextResponse.json(
      { ok: false, error: 'internal_server_error' },
      { status: 500 }
    );
  }
}
