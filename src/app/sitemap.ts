import { MetadataRoute } from 'next';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

const DEFAULT_BLOG_SLUGS = [
  'mastering-compromised-running-functional-fitness',
  'traditional-mudgar-mace-swings-in-modern-fitness'
];

async function getBlogSlugs(): Promise<string[]> {
  try {
    const baseUrl = getApiUrl().endsWith('/') ? getApiUrl() : `${getApiUrl()}/`;
    const res = await fetch(`${baseUrl}blogs`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((b: any) => b.slug);
      }
    }
  } catch (err) {
    console.error('Failed to fetch blog slugs for sitemap:', err);
  }
  return DEFAULT_BLOG_SLUGS;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.athlion.in';
  const currentDate = new Date().toISOString();

  const blogSlugs = await getBlogSlugs();
  const blogSitemapEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/functional-fitness/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/functional-fitness`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/functional-fitness/training`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/functional-fitness/workouts`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sponsors`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  return [...staticEntries, ...blogSitemapEntries];
}
