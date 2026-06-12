'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  if (!images.length) return (
    <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center text-gray-300 rounded">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square bg-[#f5f5f5] rounded overflow-hidden">
        <Image
          src={images[active]}
          alt={`${name} - imagem ${active + 1}`}
          fill
          className="object-contain p-8 transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 bg-[#f5f5f5] rounded overflow-hidden flex-shrink-0 transition-all ${
                i === active ? 'ring-2 ring-[#0a0a0a]' : 'ring-1 ring-gray-200 hover:ring-gray-400'
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumb ${i + 1}`}
                fill
                className="object-contain p-2"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
