'use client'

import ProductForm from '@/components/ProductForm'

interface ProductData {
  id?: string
  name: string
  description: string
  price: string
  sport: string
  category: string
  sizes: string[]
  images: string[]
  stock: Record<string, number>
  active: boolean
  featured: boolean
}

export default function ProductFormClient({ initial }: { initial: ProductData }) {
  return <ProductForm initial={initial} isEdit />
}
