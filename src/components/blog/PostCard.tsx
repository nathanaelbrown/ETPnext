// components/blog/PostCard.tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { urlForImage } from '@/sanity/image'

type Post = {
  title: string
  excerpt?: string | null
  slug: string
  coverImage?: unknown
  categories?: Array<string | null | undefined>
  publishedAt?: string | null
}

export default function PostCard({
  post,
  hrefBase = '/resources',
}: {
  post: Post
  hrefBase?: string
}) {
  const dateText = formatDate(post.publishedAt)
  const href = `${hrefBase.replace(/\/$/, '')}/${encodeURIComponent(post.slug)}`

  return (
    <article className="group h-full min-w-0 overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-sm backdrop-blur transition hover:shadow-md">
      {/* Image with padding & consistent ratio */}
      {post.coverImage && (
        <div className="p-3">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-black/5">
            <img
              src={urlForImage(post.coverImage).width(1200).height(675).url()}
              alt={post.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="px-6 pb-6 min-w-0">
        {dateText && (
          <div className="mb-2 text-sm text-neutral-500">
            {dateText}
          </div>
        )}

        <h3 className="text-2xl font-semibold leading-snug tracking-tight text-neutral-900 group-hover:underline">
          <Link href={href as any}>{post.title}</Link>
        </h3>

        {post.excerpt && (
          <p className="mt-3 text-neutral-700 md:text-base break-words [overflow-wrap:anywhere] line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {(post.categories || []).slice(0, 2).map((c) => (
            <Badge key={c} variant="outline" className={catClass(c)}>
              {c}
            </Badge>
          ))}

          <Link
            href={href as any}
            className="ml-auto text-sm font-medium text-blue-700 hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}

/* helpers */
function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function catClass(raw?: string | null) {
  const c = (raw ?? '').toLowerCase()
  switch (c) {
    case 'commercial':
      return 'border-blue-200 bg-blue-50 text-blue-700'
    case 'residential':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'policy':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'county news':
      return 'border-teal-200 bg-teal-50 text-teal-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700'
  }
}




