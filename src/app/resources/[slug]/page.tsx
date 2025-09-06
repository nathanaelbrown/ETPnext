// src/app/resources/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { urlForImage } from '@/sanity/image'
import PostTOC, { type TocItem } from '@/components/blog/PostTOC'
import InlineCTA from '@/components/blog/InlineCTA'
import ShareRow from '@/components/blog/ShareRow'
import ContentSections from '@/components/CountySections' // alias of CountySections is fine
import clsx from 'clsx'

export const revalidate = 300

// Keep this in sync with County page
const SECTIONS_PROJECTION = `
  sections[]{
    _type,
    // hero
    eyebrow, heading, subheading, image{ image, alt, caption },
    // text
    body[],
    // image
    media{ image, alt, caption },
    // stats
    items[]{ label, value },
    // faq
    items[]{ question, answer[] },
    // callout
    tone,
    // two-col
    left[], right[],
    // cta
    heading, buttonLabel, buttonHref, body[],
  }
`

const POST = defineQuery(`
  *[_type=="post" && lower(slug.current) == lower($slug)][0]{
    title, excerpt, seoTitle, seoDescription, coverImage,
    "slug": slug.current, categories, publishedAt, updatedAt,
    ${SECTIONS_PROJECTION},
    // legacy field you already use in this page:
    content
  }
`)

export default async function ResourcePost(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const doc = await client.fetch(POST, { slug })
  if (!doc) return notFound()

  const hasSections = Array.isArray(doc.sections) && doc.sections.length > 0
  const hasHeroSection = hasSections && doc.sections.some((s: any) => s?._type === 'heroSection')

  // ===== Legacy path (no sections): keep your TOC + inline CTA behavior =====
  let toc: TocItem[] = []
  let blocks: PortableTextBlock[] = []
  let hasTOC = false
  let insertAt = 0

  if (!hasSections) {
    const res = extractHeadings(doc.content || [])
    toc = res.toc
    blocks = res.augmented as PortableTextBlock[]
    hasTOC = toc.length >= 2
    insertAt = Math.max(3, Math.floor(blocks.length * 0.4))
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div className={clsx('grid gap-8', !hasSections && hasTOC && 'lg:grid-cols-[280px_minmax(0,1fr)]')}>
        {/* TOC only for legacy posts */}
        {!hasSections && hasTOC && <PostTOC items={toc} />}

        {/* Article */}
        <article
  className={clsx(
    'prose prose-neutral md:prose-lg max-w-none font-sans ' +
      'prose-headings:font-serif ' +
      'prose-h1:text-4xl md:prose-h1:text-5xl ' +
      'prose-h2:text-2xl md:prose-h2:text-3xl ' +
      'prose-p:leading-7',
    !hasSections && !hasTOC && 'max-w-3xl'
  )}
>
          {/* Header card (hide big cover image if a hero section will render it anyway) */}
          <div className="rounded-2xl bg-neutral-50 p-6 md:p-8">
            <a href="/resources" className="text-sm text-neutral-600 hover:underline">
              &larr; Back to Resources
            </a>

            <div className="mt-3">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
                {doc.title}
              </h1>
              {doc.excerpt && (
                <p className="mt-3 text-neutral-700 md:text-lg">
                  {doc.excerpt}
                </p>
              )}
            </div>

            {/* Only show header cover if we are NOT rendering a heroSection */}
            {!hasHeroSection && doc.coverImage && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img
                  src={urlForImage(doc.coverImage).width(1600).url()}
                  alt={doc.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            )}

            <ShareRow title={doc.title} />
          </div>

          {/* Preferred: flexible sections (shared with County) */}
          {hasSections ? (
            <div className="mt-8">
              <ContentSections sections={doc.sections} />
            </div>
          ) : (
            // Legacy fallback: your original PortableText + inline CTA
            <div className="mt-8 max-w-none">
              <PortableText value={blocks.slice(0, insertAt)} components={blogPT} />
              <InlineCTA
                heading="How much are you overpaying?"
                body="Find out in minutes—enter your address and we’ll estimate your potential savings."
                button="Estimate Your Savings"
                href="/"
              />
              <PortableText value={blocks.slice(insertAt)} components={blogPT} />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const doc = await client.fetch(POST, { slug })
  if (!doc) return {}
  const title = doc.seoTitle || doc.title
  const description = doc.seoDescription || doc.excerpt || undefined
  return {
    title,
    description,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: { title, description, type: 'article', url: `/resources/${slug}` },
  }
}

const ALL = defineQuery(`*[_type=="post" && defined(slug.current)][].slug.current`)
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(ALL)
  return slugs.map((slug) => ({ slug }))
}
export const dynamicParams = false

/* ---------- helpers & PT components (unchanged) ---------- */

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
}

// Parse Sanity blocks for h2/h3, attach ids for anchors, and build a TOC list
function extractHeadings(blocks: any[]): { toc: TocItem[]; augmented: any[] } {
  const toc: TocItem[] = []
  const augmented = blocks.map((b) => {
    if (b?._type === 'block' && (b.style === 'h2' || b.style === 'h3') && Array.isArray(b.children)) {
      const text = b.children.map((c: any) => c.text || '').join('').trim()
      const id = slugify(text || `section-${b._key || Math.random().toString(36).slice(2)}`)
      toc.push({ id, text: text || 'Section', level: b.style === 'h2' ? 2 : 3 })
      return { ...b, _key: b._key || id, _idForHeading: id }
    }
    return b
  })
  return { toc, augmented }
}

const blogPT: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={(value as any)?._idForHeading} className="mt-12 scroll-mt-24 text-3xl font-semibold">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={(value as any)?._idForHeading} className="mt-8 text-2xl font-semibold">
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className="mt-5 leading-7">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 rounded-lg border-l-4 border-neutral-300 bg-neutral-50/60 p-4 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc pl-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal pl-6 space-y-2">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={(value as any)?.href}
        className="font-medium underline underline-offset-4 hover:text-blue-700"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
  },
}
