'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Promotion {
  id: string
  title: string
  subtitle?: string | null
  color1: string
  color2: string
  link?: string | null
  active: boolean
  sortOrder: number
}

export default function AdminPromocoesPage() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetch_ = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/promotions')
    setPromos(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir promoção "${title}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    setPromos(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Promoções do Carrossel</h1>
          <p className="text-gray-400 text-sm mt-0.5">{promos.length} promoção(ões)</p>
        </div>
        <Link
          href="/admin/promocoes/novo"
          className="px-4 py-2.5 bg-[#0a0a0a] text-white text-sm font-bold hover:bg-[#e63946] transition-colors"
        >
          + Nova Promoção
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center text-gray-400">
          <p className="text-lg font-medium">Nenhuma promoção cadastrada</p>
          <Link href="/admin/promocoes/novo" className="inline-block mt-4 text-sm underline hover:text-black">
            Criar primeira promoção
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map(promo => (
            <div key={promo.id} className="bg-white rounded shadow-sm p-4 flex items-center gap-4">
              {/* Color preview */}
              <div
                className="w-16 h-16 rounded flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${promo.color1}, ${promo.color2})` }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">{promo.title}</h3>
                  {!promo.active && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Inativo</span>
                  )}
                </div>
                {promo.subtitle && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{promo.subtitle}</p>
                )}
                {promo.link && (
                  <p className="text-xs text-blue-400 mt-0.5">→ {promo.link}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/promocoes/${promo.id}`}
                  className="text-xs px-3 py-1.5 border border-gray-200 hover:border-[#0a0a0a] rounded transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(promo.id, promo.title)}
                  disabled={deleting === promo.id}
                  className="text-xs px-3 py-1.5 text-red-500 border border-red-100 hover:border-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                >
                  {deleting === promo.id ? '...' : 'Excluir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
