// app/resources/page.tsx (SERVER COMPONENT)
import HeroRail from '@/components/blog/HeroRail'
import PostCard from '@/components/blog/PostCard'
import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'

export const revalidate = 300

const FEATURED = defineQuery(`
  *[_type=="post" && featured == true] | order(publishedAt desc)[0...6]{
    title, excerpt, "slug": slug.current, coverImage, categories, publishedAt
  }
`)

const RECENTS = defineQuery(`
  *[_type=="post"] | order(publishedAt desc)[0...12]{
    title, excerpt, "slug": slug.current, coverImage, categories, publishedAt
  }
`)

export default async function ResourcesIndex() {
  const [featured, recent]: [any[], any[]] = await Promise.all([
    client.fetch(FEATURED),
    client.fetch(RECENTS),
  ])

  const heroPosts = (featured?.length ? featured : recent?.slice(0, 6)) ?? []

  return (
    <div className="min-h-screen bg-background">
    

      {/* Hero rail over a background image */}
      <HeroRail posts={heroPosts} />

      {/* Optional promo row — tweak or remove */}
      <section className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-semibold">Explore more</h2>
        <p className="text-neutral-600 mt-1">Guides, insights, and updates on Texas property taxes.</p>
      </section>

      {/* Recent grid */}
      <section className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-semibold">Most Recent</h2>
        {!recent?.length ? (
          <p className="mt-6 text-neutral-600">No posts yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p: any) => (
              <PostCard key={p.slug} post={p} /* hrefBase defaults to '/resources' */ />
            ))}
          </div>
        )}
      </section>

   
    </div>
  )
}
