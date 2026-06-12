import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const esporte = searchParams.get('esporte')
  const categoria = searchParams.get('categoria')
  const tamanho = searchParams.get('tamanho')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = { active: true }
  if (esporte) where.sport = esporte
  if (categoria) where.category = categoria
  if (search) where.name = { contains: search }

  let products = await prisma.product.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: { id: true, name: true, price: true, sport: true, category: true, images: true, sizes: true, stock: true },
  })

  if (tamanho) {
    products = products.filter(p => {
      try {
        const sizes = JSON.parse(p.sizes) as string[]
        const stock = JSON.parse(p.stock) as Record<string, number>
        return sizes.includes(tamanho) && (stock[tamanho] ?? 0) > 0
      } catch {
        return false
      }
    })
  }

  return NextResponse.json(products)
}
