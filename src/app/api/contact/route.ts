import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ContactSubmission, SiteSettings } from '@/lib/models';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Required fields are missing' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Save to DB
    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      service,
      message,
      status: 'unread'
    });

    // 2. Fetch notification email override from settings if configured
    const settings = await SiteSettings.findOne();
    const notifyEmail = settings?.smtpNotifyEmail || process.env.NOTIFY_EMAIL || process.env.SMTP_FROM_EMAIL;

    // 3. Send email via SMTP if configured
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (host && user && pass && notifyEmail) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: { user, pass },
        });

        await transporter.sendMail({
          from: `"${settings?.siteName || 'Tectoflow'} Notifications" <${process.env.SMTP_FROM_EMAIL || user}>`,
          to: notifyEmail,
          subject: `New Contact Submission from ${name}`,
          text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Service Interested In: ${service || 'General'}

Message:
${message}
          `,
          html: `
<h3>New Contact Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'N/A'}</p>
<p><strong>Service:</strong> ${service || 'General'}</p>
<br/>
<p><strong>Message:</strong></p>
<div style="background: #f4f4f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
          `
        });
      } catch (emailError) {
        console.error('SMTP Email notification failed to send:', emailError);
      }
    } else {
      console.warn('SMTP configuration is missing. Contact submission saved to database, but notification email was not sent.');
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
