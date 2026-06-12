'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Carousel3DScene = dynamic(() => import('./Carousel3DScene'), { ssr: false })

interface Promotion {
  id: string
  title: string
  subtitle?: string | null
  link?: string | null
  color1: string
  color2: string
}

interface Props {
  promotions: Promotion[]
}

export default function Carousel3D({ promotions }: Props) {
  const [current, setCurrent] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const n = promotions.length

  const next = useCallback(() => setCurrent(c => (c + 1) % n), [n])
  const prev = useCallback(() => setCurrent(c => (c - 1 + n) % n), [n])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 })
    setPaused(false)
  }, [])

  if (!promotions.length) return null

  const current_promo = promotions[current]

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0a0a0a]"
      style={{ height: 'clamp(380px, 55vw, 580px)' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D canvas */}
      <div className="absolute inset-0">
        <Carousel3DScene promotions={promotions} current={current} mouse={mouse} />
      </div>

      {/* Overlay gradient at edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

      {/* CTA button overlay (on top) */}
      {current_promo.link && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <Link
            href={current_promo.link}
            className="inline-block px-8 py-3 bg-white text-black text-sm font-bold tracking-wider hover:bg-[#e63946] hover:text-white transition-all duration-300"
          >
            VER COLEÇÃO
          </Link>
        </div>
      )}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all rounded-full"
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all rounded-full"
        aria-label="Próximo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {promotions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
