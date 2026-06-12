import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Manto Sports — Camisas Esportivas',
  description: 'A melhor seleção de camisas de futebol e basquete, incluindo linha retrô exclusiva.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
