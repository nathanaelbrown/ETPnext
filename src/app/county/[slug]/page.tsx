// src/app/county/[slug]/page.tsx
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { defineQuery } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { urlForImage } from '@/sanity/image'
import CountySections from '@/components/CountySections'
import { ptComponents } from '@/components/portableTextComponents'
import clsx from 'clsx'
import { Header } from '@/components/Header' 

export const revalidate = 300

const COUNTY_QUERY = defineQuery(`
  *[_type=="county" && slug.current == $slug][0]{
    title,
    excerpt,
    seoTitle,
    seoDescription,
    "slug": slug.current,
    heroImage,
    publishedAt,
    updatedAt,
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
      heading, buttonLabel, buttonHref, body[], showAddressSearch,
      // textWithImageSection - FIX THIS:
      image,              // Remove the nested structure
      imageAlt,
      caption,
      imagePosition
    }
  }
`)

// PAGE (await params)
export default async function CountyArticlePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params

  const doc = await client.fetch(COUNTY_QUERY, { slug })
  if (!doc) return notFound()

  // ✅ If a heroSection exists, don't also show the legacy heroImage
  const hasHeroSection =
    Array.isArray(doc.sections) && doc.sections.some((s: any) => s?._type === 'heroSection')

    return (
      <>
        <Header />
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <article className={clsx(
            'prose prose-neutral md:prose-lg max-w-none font-sans ' +
              'prose-headings:font-sans ' +
              'prose-h1:text-4xl md:prose-h1:text-5xl ' +
              'prose-h2:text-2xl md:prose-h2:text-3xl ' +
              'prose-p:leading-7'
          )}>
            <h1>{doc.title}</h1>
            {doc.excerpt && <p className="text-xl text-gray-600 mb-8 font-normal leading-relaxed">{doc.excerpt}</p>}
    
            {/* All your existing content stays exactly the same */}
            {!hasHeroSection && doc.heroImage && (
              <img
                src={urlForImage(doc.heroImage).width(600).url()}
                alt={doc.title}
                className="mt-4 w-full max-w-4xl rounded-xl mx-auto"
                loading="lazy"
              />
            )}
    
            {doc.sections?.length ? (
              <CountySections sections={doc.sections} />
            ) : doc.body ? (
              <div className="mt-6 max-w-none">
                <PortableText value={doc.body} />
              </div>
            ) : null}
    
            {/* JSON-LD stays the same */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: doc.seoTitle || doc.title,
                  description: doc.seoDescription || doc.excerpt,
                  datePublished: doc.publishedAt,
                  dateModified: doc.updatedAt || doc.publishedAt,
                  mainEntityOfPage: `/county/${doc.slug}`,
                }),
              }}
            />
          </article>
        </div>
      </>
    )
}

// METADATA (await params)
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params

  const doc = await client.fetch(COUNTY_QUERY, { slug })
  if (!doc) return {}

  const title = doc.seoTitle || doc.title
  const description = doc.seoDescription || doc.excerpt || undefined

  return {
    title,
    description,
    alternates: { canonical: `/county/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/county/${slug}`,
    },
  }
}

// Static params (ISR)
const ALL_SLUGS = defineQuery(`*[_type=="county" && defined(slug.current)][].slug.current`)
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(ALL_SLUGS)
  return slugs.map((slug) => ({ slug }))
}
export const dynamicParams = false


