import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
} as any);

export async function POST(req: NextRequest) {
  try {
    // Verify admin
    const token = req.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');

    let response: any;
    if (imagekit.files && typeof imagekit.files.upload === 'function') {
      response = await imagekit.files.upload({
        file: base64File,
        fileName: file.name,
        folder: '/tectoflow',
      });
    } else if (typeof (imagekit as any).upload === 'function') {
      response = await (imagekit as any).upload({
        file: base64File,
        fileName: file.name,
        folder: '/tectoflow',
      });
    } else {
      throw new Error('ImageKit upload method not found in SDK');
    }

    return NextResponse.json({
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    });
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
