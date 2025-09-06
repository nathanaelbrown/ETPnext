'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PostCard from './PostCard'
import { urlForImage } from '@/sanity/image'

type Post = {
  slug: string
  title: string
  coverImage?: unknown
  excerpt?: string | null
  categories?: string[]
  publishedAt?: string | null
}

const ANIM_MS = 420

export default function HeroRail({ posts = [] as Post[] }) {
  const railRef = useRef<HTMLDivElement>(null)   // viewport (overflow hidden)
  const trackRef = useRef<HTMLDivElement>(null)  // flex row with gap
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  // Leftmost visible card index
  const [active, setActive] = useState(0)

  // Measured layout
  const [cardW, setCardW] = useState(0)
  const [gap, setGap] = useState(24) // default matches gap-6

  // Compute transform offset (rounded to avoid subpixel drift)
  const offset = Math.max(0, Math.round(active * (cardW + gap)))

  // ---- Measure card width & real flex gap from the TRACK ----
  const measure = useCallback(() => {
    const track = trackRef.current
    const first = cardRefs.current[0]
    if (!track || !first) return

    // 1) Card width
    const w = first.getBoundingClientRect().width

    // 2) Gap: try computed style on the TRACK, fall back to delta between first two cards
    let g = 0
    const styles = getComputedStyle(track)
    // try `column-gap` / `gap`
    g =
      parseFloat(styles.columnGap || styles.gap || '0') ||
      0

    // fallback: measure between first and second cards
    const second = cardRefs.current[1]
    if (second) {
      const r1 = first.getBoundingClientRect()
      const r2 = second.getBoundingClientRect()
      const inferred = Math.round(r2.left - r1.right)
      if (Number.isFinite(inferred) && inferred >= 0) g = inferred
    }

    setCardW(Math.max(0, Math.round(w)))
    setGap(Math.max(0, Math.round(g)))
  }, [])

  useEffect(() => {
    measure()
    const roTrack = new ResizeObserver(measure)
    const roFirst = new ResizeObserver(measure)
    if (trackRef.current) roTrack.observe(trackRef.current)
    if (cardRefs.current[0]) roFirst.observe(cardRefs.current[0]!)
    window.addEventListener('resize', measure)
    return () => {
      roTrack.disconnect()
      roFirst.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // ---- Hero background cross-fade (leftmost card drives it) ----
  const targetBg = useMemo(() => {
    const img = posts[active]?.coverImage
    return img ? urlForImage(img).width(2400).height(1200).url() : ''
  }, [posts, active])

  const [srcA, setSrcA] = useState<string>(targetBg)
  const [srcB, setSrcB] = useState<string>('')
  const [showA, setShowA] = useState(true)
  const [pending, setPending] = useState<'A' | 'B' | null>(null)

  useEffect(() => {
    const current = showA ? srcA : srcB
    if (targetBg === current) return
    if (!targetBg) { setSrcA(''); setSrcB(''); setPending(null); return }
    if (showA) { setSrcB(targetBg); setPending('B') } else { setSrcA(targetBg); setPending('A') }
  }, [targetBg, showA, srcA, srcB])

  const onLoadA = () => { if (pending === 'A') { setShowA(true); setPending(null) } }
  const onLoadB = () => { if (pending === 'B') { setShowA(false); setPending(null) } }

  // ---- Controls: move exactly one card ----
  const canPrev = active > 0
  const canNext = active < Math.max(0, posts.length - 1)

  const prev = () => { if (canPrev) setActive(i => i - 1) }
  const next = () => { if (canNext) setActive(i => i + 1) }

  // Clicking a card makes it the leftmost
  const jumpTo = (i: number) => setActive(i)

  // Start at first
  useEffect(() => { setActive(0) }, [posts.length])

  return (
    <section className="relative isolate">
      {/* Background base + cross-fade */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-600" />
      </div>
      {srcA ? (
        <img
          src={srcA}
          alt=""
          onLoad={onLoadA}
          aria-hidden
          className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ${showA ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
      {srcB ? (
        <img
          src={srcB}
          alt=""
          onLoad={onLoadB}
          aria-hidden
          className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ${showA ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : null}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Foreground */}
      <div className="relative z-20 mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* Left column: heading + arrows */}
          <div className="lg:col-span-4">
            <h1 className="text-4xl md:text-5xl font-semibold text-white">Blog</h1>
            <p className="mt-2 max-w-md text-white/90">
              Our blogs provide the most useful information to help property owners manage their real estate with confidence.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={prev}
                disabled={!canPrev}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-800 shadow transition ${
                  !canPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                disabled={!canNext}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-800 shadow transition ${
                  !canNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
                }`}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right column: controlled slider */}
          <div className="lg:col-span-8">
            <div ref={railRef} className="overflow-hidden pb-4">
              <div
                ref={trackRef}
                className="flex gap-6 will-change-transform"
                style={{
                  transform: `translate3d(-${offset}px, 0, 0)`,
                  transition: `transform ${ANIM_MS}ms cubic-bezier(.22,.61,.36,1)`,
                  width: 'max-content',
                }}
              >
                {(posts ?? []).map((p, i) => (
                  <div
                    key={p.slug ?? i}
                    ref={(el) => { cardRefs.current[i] = el }}
                    className="shrink-0 w-[420px] md:w-[480px] lg:w-[560px]" // adjust sizes as you like
                    onClick={() => jumpTo(i)}
                  >
                    <PostCard post={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



