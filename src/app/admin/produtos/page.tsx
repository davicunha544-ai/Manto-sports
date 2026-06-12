'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  sport: string
  category: string
  images: string
  active: boolean
  stock: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await fetch(`/api/admin/products${params}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  const totalStock = (stockJson: string) => {
    try {
      return Object.values(JSON.parse(stockJson) as Record<string, number>).reduce((a, b) => a + b, 0)
    } catch { return 0 }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Produtos</h1>
          <p className="text-gray-400 text-sm mt-0.5">{products.length} produto(s)</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="px-4 py-2.5 bg-[#0a0a0a] text-white text-sm font-bold hover:bg-[#e63946] transition-colors"
        >
          + Novo Produto
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 bg-white rounded focus:border-[#0a0a0a] focus:outline-none"
        />
        <svg className="absolute left-3 top-3 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produto</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Esporte</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Categoria</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Estoque</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 animate-pulse rounded" />
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-32" />
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell"><div className="h-4 bg-gray-100 animate-pulse rounded w-16" /></td>
                  <td className="py-3 px-4 hidden md:table-cell"><div className="h-4 bg-gray-100 animate-pulse rounded w-12" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-100 animate-pulse rounded w-16 ml-auto" /></td>
                  <td className="py-3 px-4 hidden md:table-cell"><div className="h-4 bg-gray-100 animate-pulse rounded w-8 ml-auto" /></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-100 animate-pulse rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              products.map(product => {
                const images = (() => { try { return JSON.parse(product.images) as string[] } catch { return [] } })()
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {images[0] && (
                            <Image src={images[0]} alt={product.name} fill className="object-contain p-1" unoptimized />
                          )}
                        </div>
                        <span className="text-sm font-medium line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-xs capitalize text-gray-600">{product.sport}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        product.category === 'retro' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {product.category === 'retro' ? 'Retrô' : 'Atual'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className={`text-sm font-medium ${totalStock(product.stock) === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {totalStock(product.stock)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="text-xs px-3 py-1.5 border border-gray-200 hover:border-[#0a0a0a] rounded transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="text-xs px-3 py-1.5 text-red-500 border border-red-100 hover:border-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                        >
                          {deleting === product.id ? '...' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
