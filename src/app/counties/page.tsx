import Link from 'next/link'
import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'
import { urlForImage } from '@/sanity/image'

export const revalidate = 300

const ALL_COUNTIES = defineQuery(`
  *[_type=="county" && defined(slug.current)]
  | order(title asc){
    title,
    excerpt,
    "slug": slug.current,
    heroImage
  }
`)

export default async function CountiesIndexPage() {
  const items: Array<{ title: string; excerpt?: string; slug: string; heroImage?: unknown }> =
    await client.fetch(ALL_COUNTIES)

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">County Guides</h1>
      <p className="mt-2 text-neutral-700">
        Learn how to protest property taxes in your county.
      </p>

      {!items?.length ? (
        <p className="mt-8 text-neutral-500">No counties yet. Add some in the Studio.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((c) => (
  <Link
    key={c.slug}
    href={{ pathname: `/county/${c.slug}` }}
    className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
            >
              {c.heroImage && (
                <img
                  src={urlForImage(c.heroImage).width(800).height(450).url()}
                  alt={c.title}
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold group-hover:underline">{c.title}</h2>
                {c.excerpt && (
                  <p
                    className="mt-2 text-neutral-600"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {c.excerpt}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

// (Optional) static metadata for the index page
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'County Guides',
  description: 'SEO articles for each county on property tax protests and tips.',
}
