import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductFormClient from './ProductFormClient'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  const initial = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    sport: product.sport,
    category: product.category,
    sizes: JSON.parse(product.sizes) as string[],
    images: JSON.parse(product.images) as string[],
    stock: JSON.parse(product.stock) as Record<string, number>,
    active: product.active,
    featured: product.featured,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/produtos" className="text-xs text-gray-400 hover:text-black flex items-center gap-1 mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar para produtos
        </Link>
        <h1 className="text-2xl font-extrabold">Editar Produto</h1>
        <p className="text-gray-400 text-sm mt-0.5">{product.name}</p>
      </div>
      <ProductFormClient initial={initial} />
    </div>
  )
}
