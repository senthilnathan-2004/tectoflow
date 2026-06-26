import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
} as any);

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // Verify admin
    const token = req.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;
    if (!fileId) {
      return NextResponse.json({ success: false, message: 'No fileId provided' }, { status: 400 });
    }

    if (imagekit.files && typeof imagekit.files.delete === 'function') {
      await imagekit.files.delete(fileId);
    } else if (typeof (imagekit as any).deleteFile === 'function') {
      await (imagekit as any).deleteFile(fileId);
    } else {
      throw new Error('ImageKit delete method not found in SDK');
    }

    return NextResponse.json({ success: true, message: 'Image deleted from ImageKit successfully' });
  } catch (error: any) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
