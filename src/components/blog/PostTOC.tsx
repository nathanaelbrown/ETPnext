'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type TocItem = { id: string; text: string; level: 2 | 3 }

export default function PostTOC({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    const headings = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    if (!headings.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )
    headings.forEach(h => obs.observe(h))
    return () => obs.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <aside className="hidden lg:block sticky top-28 h-[calc(100vh-7rem)] overflow-auto pr-6">
      <h3 className="mb-3 text-lg font-semibold">Table of Contents</h3>
      <nav className="space-y-1 text-sm">
        {items.map(i => (
          <Link
            key={i.id}
            href={`#${i.id}`}
            className={`block rounded-md px-3 py-2 transition ${
              active === i.id ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
            } ${i.level === 3 ? 'ml-3' : ''}`}
          >
            {i.text}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
