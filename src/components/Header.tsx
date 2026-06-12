'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import { useCart } from './CartProvider'

export default function Header() {
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Home
            </Link>
            <Link
              href="/catalogo"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/catalogo?categoria=retro"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Linha Retrô
            </Link>
            <Link
              href="/catalogo?esporte=futebol"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Futebol
            </Link>
            <Link
              href="/catalogo?esporte=basquete"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Basquete
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Cart icon */}
            <Link href="/carrinho" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#e63946] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/catalogo', label: 'Catálogo' },
              { href: '/catalogo?categoria=retro', label: 'Linha Retrô' },
              { href: '/catalogo?esporte=futebol', label: 'Futebol' },
              { href: '/catalogo?esporte=basquete', label: 'Basquete' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
