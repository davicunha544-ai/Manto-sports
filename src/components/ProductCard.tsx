'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  sport: string
  category: string
  images: string
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const images = (() => {
    try { return JSON.parse(product.images) as string[] } catch { return [] }
  })()

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 16, y: -x * 16 })
  }, [])

  const handleLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }, [])

  const sport_label = product.sport === 'futebol' ? 'Futebol' : 'Basquete'
  const cat_label = product.category === 'retro' ? 'Retrô' : 'Atual'

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="tilt-card cursor-pointer"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
      }}
    >
      <Link href={`/produto/${product.id}`} className="block">
        {/* Image */}
        <div
          className="relative overflow-hidden bg-[#f5f5f5] rounded-sm"
          style={{ aspectRatio: '4/5' }}
        >
          {images[0] ? (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className={`object-contain p-6 transition-transform duration-500 ${hovered ? 'scale-108' : 'scale-100'}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.category === 'retro' && (
              <span className="px-2 py-0.5 bg-[#0a0a0a] text-white text-[10px] font-bold tracking-wider uppercase">
                Retrô
              </span>
            )}
            <span className="px-2 py-0.5 bg-white/80 backdrop-blur-sm text-gray-700 text-[10px] font-medium tracking-wider uppercase border border-gray-200">
              {sport_label}
            </span>
          </div>

          {/* Hover shine */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.12), transparent 60%)`,
              opacity: hovered ? 1 : 0,
            }}
          />
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">{sport_label} · {cat_label}</p>
          <h3 className="font-semibold text-[0.95rem] leading-snug text-gray-900 group-hover:text-black line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-2 font-bold text-[1.05rem] text-[#0a0a0a]">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </Link>
    </div>
  )
}
