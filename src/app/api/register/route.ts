// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import argon2 from 'argon2';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // max 5 registrations/min per IP
});

const RegisterSchema = z
  .object({
    ownerName: z.string().min(2),
    petName: z.string().min(1),
    email: z.string().email(),
    username: z.string().min(3).regex(/^[a-z0-9_]+$/i),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export async function POST(req: NextRequest) {
  try {
    // Get IP from headers (NextRequest doesn't have .ip property)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0]?.trim() || '127.0.0.1' : '127.0.0.1';
    const { success } = await limiter.limit(`register:${ip}`);
    
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const payload = await req.json();
    const parsed = RegisterSchema.safeParse(payload);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { ownerName, petName, email, username, password } = parsed.data;

    const exists = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    
    if (exists) {
      return NextResponse.json(
        { error: 'Email or username already in use' },
        { status: 409 }
      );
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    const user = await db.user.create({
      data: {
        ownerName,
        petName,
        email,
        username,
        passwordHash,
        page: {
          create: {
            slug: username,
            displayName: petName,
          },
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

