import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@tectoflow.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

    // Support both plaintext and basic checks
    // If the user wants a hashed check, they can configure it, but let's check exact match
    if (email === expectedEmail && password === expectedPassword) {
      const token = generateToken({ email });

      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      return NextResponse.json({ success: true, message: 'Logged in successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
