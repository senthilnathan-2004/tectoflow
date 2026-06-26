import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { NewsletterSubscriber } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: true, message: 'You are already subscribed!' });
    }

    await NewsletterSubscriber.create({ email });

    return NextResponse.json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error: any) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
