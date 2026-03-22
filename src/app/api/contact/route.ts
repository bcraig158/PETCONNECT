import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { env } from '@/lib/env';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!resend) {
      if (env.isDev) {
        console.log('[dev] Contact form submission:', { name, email, message });
      }
      return NextResponse.json({ ok: true });
    }

    const toEmail = env.contactToEmail;
    if (!toEmail) {
      console.error('CONTACT_TO_EMAIL is not configured');
      return NextResponse.json({ error: 'Contact email not configured' }, { status: 500 });
    }

    const result = await resend.emails.send({
      from: env.contactFromEmail,
      to: toEmail,
      subject: `PetConnect Contact: ${name}`,
      reply_to: email,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json({ error: 'Send failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

