'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageGallery from '@/components/ImageGallery'
import SizeSelector from '@/components/SizeSelector'
import { useCart } from '@/components/CartProvider'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sport: string
  category: string
  sizes: string
  images: string
  stock: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 animate-pulse rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4" />
            <div className="h-6 bg-gray-100 animate-pulse rounded w-1/4" />
            <div className="h-24 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )

  if (!product) return (
    <>
      <Header />
      <main className="flex-1 pt-24 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-xl font-bold">Produto não encontrado</p>
          <button onClick={() => router.push('/catalogo')} className="mt-4 text-sm underline">
            Voltar ao catálogo
          </button>
        </div>
      </main>
      <Footer />
    </>
  )

  const images = JSON.parse(product.images) as string[]
  const sizes = JSON.parse(product.sizes) as string[]
  const stock = JSON.parse(product.stock) as Record<string, number>

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: images[0] || '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const sport_label = product.sport === 'futebol' ? 'Futebol' : 'Basquete'
  const cat_label = product.category === 'retro' ? 'Retrô' : 'Atual'

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <button onClick={() => router.push('/')} className="hover:text-black transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/catalogo')} className="hover:text-black transition-colors">Catálogo</button>
            <span>/</span>
            <span className="text-gray-600">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <ImageGallery images={images} name={product.name} />

            {/* Details */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                  {sport_label} · {cat_label}
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a0a0a] leading-tight">
                  {product.name}
                </h1>
                <p className="mt-4 text-3xl font-bold text-[#0a0a0a]">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ou 3x de R$ {(product.price / 3).toFixed(2).replace('.', ',')} sem juros
                </p>
              </div>

              <div className="h-px bg-gray-100" />

              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

              <div className="h-px bg-gray-100" />

              <SizeSelector
                sizes={sizes}
                stock={stock}
                selected={selectedSize}
                onChange={setSelectedSize}
              />

              {/* Guia de tamanhos */}
              <button className="text-xs text-left text-gray-400 underline hover:text-black transition-colors">
                Guia de tamanhos
              </button>

              {/* Add to cart */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`flex-1 h-14 font-bold text-sm tracking-wider transition-all duration-200 ${
                    added
                      ? 'bg-green-600 text-white'
                      : selectedSize
                      ? 'bg-[#0a0a0a] text-white hover:bg-[#e63946]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {added ? '✓ ADICIONADO AO CARRINHO' : !selectedSize ? 'SELECIONE UM TAMANHO' : 'ADICIONAR AO CARRINHO'}
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: '🚚', text: 'Frete grátis acima de R$ 299' },
                  { icon: '↩️', text: 'Troca fácil em 30 dias' },
                  { icon: '🔒', text: 'Pagamento seguro' },
                ].map(b => (
                  <div key={b.text} className="text-center p-3 bg-[#f8f8f8] rounded">
                    <span className="text-xl">{b.icon}</span>
                    <p className="text-[10px] text-gray-500 mt-1 leading-tight">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
