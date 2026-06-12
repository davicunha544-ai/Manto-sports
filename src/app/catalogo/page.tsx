'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Product {
  id: string
  name: string
  price: number
  sport: string
  category: string
  images: string
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [esporte, setEsporte] = useState(searchParams.get('esporte') || '')
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '')
  const [tamanho, setTamanho] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (esporte) params.set('esporte', esporte)
      if (categoria) params.set('categoria', categoria)
      if (tamanho) params.set('tamanho', tamanho)
      if (search) params.set('search', search)

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [esporte, categoria, tamanho, search])

  const FilterBtn = ({
    active,
    onClick,
    children,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border transition-all ${
        active
          ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
      }`}
    >
      {children}
    </button>
  )

  const activeTitle =
    categoria === 'retro'
      ? 'Linha Retrô'
      : esporte === 'futebol'
      ? 'Futebol'
      : esporte === 'basquete'
      ? 'Basquete'
      : 'Catálogo'

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a]">{activeTitle}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {loading ? '...' : `${products.length} produto${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px] max-w-[240px]">
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 focus:border-[#0a0a0a] focus:outline-none transition-colors"
              />
              <svg
                className="absolute left-2.5 top-2.5 text-gray-400"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

            {/* Esporte */}
            <FilterBtn active={esporte === ''} onClick={() => setEsporte('')}>Todos</FilterBtn>
            <FilterBtn active={esporte === 'futebol'} onClick={() => setEsporte(esporte === 'futebol' ? '' : 'futebol')}>
              ⚽ Futebol
            </FilterBtn>
            <FilterBtn active={esporte === 'basquete'} onClick={() => setEsporte(esporte === 'basquete' ? '' : 'basquete')}>
              🏀 Basquete
            </FilterBtn>

            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

            {/* Categoria */}
            <FilterBtn active={categoria === 'atual'} onClick={() => setCategoria(categoria === 'atual' ? '' : 'atual')}>
              Atual
            </FilterBtn>
            <FilterBtn active={categoria === 'retro'} onClick={() => setCategoria(categoria === 'retro' ? '' : 'retro')}>
              Retrô
            </FilterBtn>

            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

            {/* Tamanhos */}
            {['P', 'M', 'G', 'GG'].map(s => (
              <FilterBtn key={s} active={tamanho === s} onClick={() => setTamanho(tamanho === s ? '' : s)}>
                {s}
              </FilterBtn>
            ))}

            {/* Clear */}
            {(esporte || categoria || tamanho || search) && (
              <button
                onClick={() => { setEsporte(''); setCategoria(''); setTamanho(''); setSearch('') }}
                className="ml-auto text-xs text-gray-400 hover:text-black underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded" />
                <div className="mt-3 h-4 bg-gray-100 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="mx-auto mb-4 text-gray-200" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function CatalogoPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="pt-28 text-center text-gray-400">Carregando...</div>}>
          <CatalogContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
