import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jijnasu.edu';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/features',
    '/about',
    '/help',
    '/auth/login',
    '/auth/register',
    '/dashboard',
    '/planner',
    '/focus',
    '/wellness',
    '/mentor',
    '/progress',
    '/community'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8
  }));
}
