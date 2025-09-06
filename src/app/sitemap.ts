import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'

const ALL = defineQuery(`*[_type=="county" && defined(slug.current)]{ "slug": slug.current, updatedAt }`)

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const rows: Array<{slug:string; updatedAt?:string}> = await client.fetch(ALL)

  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    ...rows.map(({slug, updatedAt}) => ({
      url: `${base}/county/${slug}`,
      lastModified: updatedAt ?? new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
