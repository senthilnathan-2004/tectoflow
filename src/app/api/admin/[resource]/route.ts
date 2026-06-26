import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import {
  HeroContent,
  AboutContent,
  TeamMember,
  ProcessStep,
  Service,
  Project,
  Review,
  PricingTier,
  FaqItem,
  BlogPost,
  ContactSubmission,
  NewsletterSubscriber,
  SiteSettings,
} from '@/lib/models';

// Map resource string to Mongoose model and check if it is a singleton
const getModelInfo = (resource: string) => {
  switch (resource) {
    case 'hero':
      return { model: HeroContent, isSingleton: true };
    case 'about':
      return { model: AboutContent, isSingleton: true };
    case 'settings':
      return { model: SiteSettings, isSingleton: true };
    case 'team':
      return { model: TeamMember, isSingleton: false };
    case 'process':
      return { model: ProcessStep, isSingleton: false };
    case 'services':
      return { model: Service, isSingleton: false };
    case 'projects':
      return { model: Project, isSingleton: false };
    case 'reviews':
      return { model: Review, isSingleton: false };
    case 'pricing':
      return { model: PricingTier, isSingleton: false };
    case 'faq':
      return { model: FaqItem, isSingleton: false };
    case 'blog':
      return { model: BlogPost, isSingleton: false };
    case 'contacts':
      return { model: ContactSubmission, isSingleton: false };
    case 'subscribers':
      return { model: NewsletterSubscriber, isSingleton: false };
    default:
      return null;
  }
};

// Middleware/Auth check helper
const checkAuth = (req: NextRequest) => {
  const token = req.cookies.get('admin_token')?.value;
  return token && verifyToken(token);
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params;
    const modelInfo = getModelInfo(resource);
    if (!modelInfo) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }

    await connectToDatabase();
    const { model, isSingleton } = modelInfo;

    // Admin authorization is required for contacts and subscribers
    if (['contacts', 'subscribers'].includes(resource)) {
      if (!checkAuth(req)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    }

    if (isSingleton) {
      let doc = await model.findOne();
      if (!doc) {
        // Return default singleton
        doc = await model.create({});
      }
      return NextResponse.json({ success: true, data: doc });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const doc = await model.findById(id);
      if (!doc) {
        return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: doc });
    }

    // Default sorting: if schema has "order" field, sort by order. Else by createdAt desc.
    const hasOrder = model.schema.paths.order !== undefined;
    const sortField: any = hasOrder ? { order: 1 } : { createdAt: -1 };
    
    // Support category filter for projects/blog
    const query: any = {};
    const category = searchParams.get('category');
    if (category && category !== 'All') {
      query.category = category;
    }

    const list = await model.find(query).sort(sortField);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    const { resource } = await params;
    console.error(`GET API error for ${resource}:`, error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { resource } = await params;
    const modelInfo = getModelInfo(resource);
    if (!modelInfo || modelInfo.isSingleton) {
      return NextResponse.json({ success: false, message: 'Invalid operation' }, { status: 400 });
    }

    await connectToDatabase();
    const { model } = modelInfo;
    const body = await req.json();

    const doc = await model.create(body);
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    const { resource } = await params;
    console.error(`POST API error for ${resource}:`, error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { resource } = await params;
    const modelInfo = getModelInfo(resource);
    if (!modelInfo) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
    }

    await connectToDatabase();
    const { model, isSingleton } = modelInfo;
    const body = await req.json();

    if (isSingleton) {
      const doc = await model.findOneAndUpdate({}, body, { new: true, upsert: true });
      return NextResponse.json({ success: true, data: doc });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || body._id;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required for update' }, { status: 400 });
    }

    const doc = await model.findByIdAndUpdate(id, body, { new: true });
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    const { resource } = await params;
    console.error(`PUT API error for ${resource}:`, error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { resource } = await params;
    const modelInfo = getModelInfo(resource);
    if (!modelInfo || modelInfo.isSingleton) {
      return NextResponse.json({ success: false, message: 'Invalid operation' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required for deletion' }, { status: 400 });
    }

    await connectToDatabase();
    const { model } = modelInfo;

    const doc = await model.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    const { resource } = await params;
    console.error(`DELETE API error for ${resource}:`, error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
