'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartProvider'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQty, total, count } = useCart()

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-4">
            <svg className="mx-auto mb-6 text-gray-200" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio</h2>
            <p className="text-gray-400 mt-2 mb-6">Explore nossa coleção e adicione produtos</p>
            <Link
              href="/catalogo"
              className="inline-block px-8 py-3 bg-[#0a0a0a] text-white text-sm font-bold tracking-wider hover:bg-[#e63946] transition-colors"
            >
              IR AO CATÁLOGO
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-extrabold mb-8">
            Carrinho <span className="text-gray-400 font-normal text-xl">({count} {count === 1 ? 'item' : 'itens'})</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-[#f5f5f5] rounded overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <path d="M3 9h18M3 15h18"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Tamanho: {item.size}</p>
                    <p className="text-sm font-bold mt-2">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>

                  {/* Qty + remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remover"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-100 rounded p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Resumo do pedido</h2>

                <div className="space-y-2 text-sm">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="truncate mr-2">{item.name} ({item.size}) ×{item.quantity}</span>
                      <span className="flex-shrink-0">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 my-4" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {total >= 299
                    ? '✓ Frete grátis!'
                    : `Faltam R$ ${(299 - total).toFixed(2).replace('.', ',')} para frete grátis`}
                </p>

                <Link
                  href="/checkout"
                  className="block mt-6 w-full py-4 bg-[#0a0a0a] text-white text-center text-sm font-bold tracking-wider hover:bg-[#e63946] transition-colors"
                >
                  FINALIZAR COMPRA
                </Link>

                <Link
                  href="/catalogo"
                  className="block mt-3 text-center text-xs text-gray-400 hover:text-black underline transition-colors"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
