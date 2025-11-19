// src/app/api/account/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import argon2 from 'argon2';

const updateProfileSchema = z.object({
  ownerName: z.string().min(2).optional(),
  petName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  { message: 'Current password required to change password', path: ['currentPassword'] }
);

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { ownerName, petName, email, currentPassword, newPassword } = parsed.data;

    // Get current user
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password if changing
    if (currentPassword && newPassword) {
      const valid = await argon2.verify(user.passwordHash, currentPassword);
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
    }

    // Check email uniqueness if changing
    if (email && email !== user.email) {
      const emailExists = await db.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    // Build update data
    const updateData: any = {};
    if (ownerName) updateData.ownerName = ownerName;
    if (petName) updateData.petName = petName;
    if (email) updateData.email = email;
    if (newPassword) {
      updateData.passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
    }

    // Update user
    const updated = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        ownerName: true,
        petName: true,
        image: true,
      },
    });

    // Update page displayName if petName changed
    if (petName) {
      await db.page.update({
        where: { userId },
        data: { displayName: petName },
      });
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
