// src/app/api/page/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend only if API key is provided (optional for development)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const contactSchema = z.object({
  pageId: z.string(),
  pageSlug: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { pageId, pageSlug, name, email, phone, message } = parsed.data;

    // Get page owner
    const page = await db.page.findUnique({
      where: { id: pageId },
      include: { user: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Send email to page owner
    if (resend && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL) {
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: page.user.email,
        reply_to: email,
        subject: `New message from ${pageSlug} profile`,
        html: `
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent via profile page: ${process.env.NEXT_PUBLIC_SITE_URL}/${pageSlug}</small></p>
        `,
      });
    } else {
      // Log in development if Resend not configured
      console.log('Page contact form submission (Resend not configured):', {
        pageSlug,
        name,
        email,
        phone,
        message,
        ownerEmail: page.user.email,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

