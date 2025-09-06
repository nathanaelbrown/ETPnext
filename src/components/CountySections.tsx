'use client'

import {PortableText} from '@portabletext/react'
import {ptComponents} from './portableTextComponents'
import {urlForImage} from '@/sanity/image'
import {useMemo} from 'react'
import AddressSearch from './AddressSearch'  // Add this import

type Section = any

export default function CountySections({sections}:{sections: Section[]}) {
  const list = sections ?? []
  return (
    <div className="mt-8 space-y-10">
      {list.map((s, i) => {
        switch (s._type) {
            case 'heroSection':
              return (
                <section key={i} className="rounded-2xl bg-green-50 p-6 border border-green-200">
                  {s.eyebrow && (
                    <p 
                      className="text-sm uppercase tracking-wider text-neutral-500" 
                      style={{ margin: 0, lineHeight: 4 }}
                    >
                      {s.eyebrow}
                    </p>
                  )}
                  {s.heading && (
                    <h2 
                      className="text-3xl font-semibold" 
                      style={{ margin: 0, marginTop: '10px', lineHeight: 1.1 }}
                    >
                      {s.heading}
                    </h2>
                  )}
                  {s.subheading && (
                    <p 
                      className="text-neutral-700" 
                      style={{ margin: 0, marginTop: '10px', lineHeight: 1.3 }}
                    >
                      {s.subheading}
                    </p>
                  )}
                  {s.image?.image && (
                    <img
                      src={urlForImage(s.image.image).width(1200).url()}
                      alt={s.image.alt || s.heading || 'Hero image'}
                      className="mt-4 w-full h-64 object-cover rounded-xl"
                      loading="lazy"
                    />
                  )}
                </section>
              )

            case 'textWithImageSection':
  return (
    <section key={i} className="grid gap-8 md:grid-cols-2 items-start">
      <div className={`max-w-none ${s.imagePosition === 'left' ? 'md:order-2' : ''}`}>
        <PortableText value={s.body} />
      </div>
      {s.image && (  // Change from s.image?.asset to just s.image
        <figure className={`${s.imagePosition === 'left' ? 'md:order-1' : ''}`}>
          <img
            src={urlForImage(s.image).width(400).url()}
            alt={s.imageAlt || s.caption || ''}
            className="rounded-xl"
            loading="lazy"
          />
          {s.caption && (
            <figcaption className="mt-2 text-sm text-gray-600 italic">
              {s.caption}
            </figcaption>
          )}
        </figure>
      )}
    </section>
  )

          case 'textSection':
            return (
              <section key={i} className="mt-8">
                <div className="max-w-none">
                  <PortableText value={s.body} />
                </div>
              </section>
            )

          case 'imageSection':
            return s.media?.image ? (
              <figure key={i}>
                <img
                  src={urlForImage(s.media.image).width(800).url()}
                  alt={s.media.alt || ''}
                  className="w-full max-w-4xl rounded-xl mx-auto"
                  loading="lazy"
                />
                {s.media.caption && <figcaption className="mt-2 text-sm text-neutral-600">{s.media.caption}</figcaption>}
              </figure>
            ) : null

          case 'statsSection':
            return (
              <section key={i} className="rounded-xl border bg-white p-4">
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {(s.items || []).map((it:any, idx:number) => (
                    <li key={idx} className="text-center">
                      <div className="text-2xl font-semibold">{it.value}</div>
                      <div className="text-sm text-neutral-600">{it.label}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )

          case 'faqSection':
            return (
              <section key={i}>
                <h3 className="text-xl font-semibold">FAQ</h3>
                <div className="mt-4 divide-y rounded-xl border bg-white">
                  {(s.items || []).map((q:any, idx:number) => (
                    <details key={idx} className="group p-4">
                      <summary className="cursor-pointer list-none font-medium">
                        {q.question}
                      </summary>
                      <div className="pt-2">
                        <PortableText value={q.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )

          case 'calloutSection': {
            const color =
              s.tone === 'success' ? 'bg-green-50 border-green-200'
              : s.tone === 'warning' ? 'bg-yellow-50 border-yellow-200'
              : s.tone === 'danger'  ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
            return (
              <aside key={i} className={`rounded-xl border ${color} p-4`}>
                <div className="max-w-none">
                  <PortableText value={s.body} />
                </div>
              </aside>
            )
          }

          case 'twoColSection':
            return (
              <section key={i} className="grid gap-6 md:grid-cols-2">
                <div className="max-w-none">
                  <PortableText value={s.left} />
                </div>
                <div className="max-w-none">
                  <PortableText value={s.right} />
                </div>
              </section>
            )

          // For an even closer match to your HeroSection
        
            case 'ctaSection':
              return (
                <section key={i} className="relative rounded-2xl bg-gradient-hero px-6 pb-4 pt-0 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <div className="relative z-10">
                    {s.heading && (
                      <h3 className="text-3xl md:text-4xl font-bold !font-sans text-foreground mb-6 leading-tight">
                        {s.heading}
                      </h3>
                    )}
                    {s.body && (
                      <div className="mx-auto mt-2 max-w-2xl mb-8">
                        <div className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                          <PortableText value={s.body} />
                        </div>
                      </div>
                    )}
                    
                    {s.showAddressSearch ? (
                      <div className="mt-8">
                        <AddressSearch />
                      </div>
                    ) : (
                      <div className="mt-8">
                        <a
                          href={s.buttonHref || '/'}
                          className="inline-block rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
                        >
                          {s.buttonLabel || 'Get started'}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )

          default:
            return null
        }
      })}
    </div>
  )
}