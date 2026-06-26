import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/db';
import { Service, Project, BlogPost } from '@/lib/models';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tectoflow.com';

  try {
    await connectToDatabase();

    const [services, projects, blogs] = await Promise.all([
      Service.find({}, { slug: 1 }),
      Project.find({}, { slug: 1 }),
      BlogPost.find({}, { slug: 1 }),
    ]);

    const serviceUrls = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(),
    }));

    const projectUrls = projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
    }));

    const blogUrls = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(),
    }));

    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
      ...serviceUrls,
      ...projectUrls,
      ...blogUrls,
    ];
  } catch (error) {
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
    ];
  }
}
