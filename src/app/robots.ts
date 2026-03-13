import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'Claude-Web', 'CCBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://www.bispecialmeze.com/sitemap.xml',
  }
}
