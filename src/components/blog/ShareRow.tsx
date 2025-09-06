'use client'

import { Share2 } from 'lucide-react'

export default function ShareRow({ title }: { title: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')

  return (
    <div className="mt-6 flex items-center gap-3 text-sm text-neutral-600">
      <Share2 className="h-4 w-4" />
      <span className="mr-2">Share</span>
      <button onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
        className="rounded-full bg-neutral-100 px-3 py-1 hover:bg-neutral-200">Facebook</button>
      <button onClick={() => open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)}
        className="rounded-full bg-neutral-100 px-3 py-1 hover:bg-neutral-200">LinkedIn</button>
      <button onClick={() => open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)}
        className="rounded-full bg-neutral-100 px-3 py-1 hover:bg-neutral-200">X</button>
      <button onClick={() => (window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`)}
        className="rounded-full bg-neutral-100 px-3 py-1 hover:bg-neutral-200">Email</button>
    </div>
  )
}
