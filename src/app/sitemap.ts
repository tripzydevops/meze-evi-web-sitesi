import { MetadataRoute } from 'next'
import { db } from '@/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.bispecialmeze.com'

  // Fetch all menu items for the sitemap
  const menuItems = await db.query.menuItems.findMany({
    where: (item, { eq }) => eq(item.hidden, false)
  })

  const menuItemUrls = menuItems.map((item) => ({
    url: `${baseUrl}/menu/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...menuItemUrls,
  ]
}
