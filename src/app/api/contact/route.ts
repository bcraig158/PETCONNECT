// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is provided (optional for development)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!resend) {
      // In development without Resend configured, just log and return success
      console.log('Contact form submission (Resend not configured):', { name, email, message });
      return NextResponse.json({ 
        ok: true, 
        message: 'Resend API not configured. Email logged to console.' 
      });
    }

    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Acme Store <onboarding@resend.dev>';
    const toEmail = process.env.CONTACT_TO_EMAIL || 'you@example.com';

    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Contact form: ${name}`,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

