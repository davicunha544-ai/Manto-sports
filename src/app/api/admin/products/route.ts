import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')

  const products = await prisma.product.findMany({
    where: search ? { name: { contains: search } } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, description, price, sport, category, sizes, images, stock, active, featured } = body

  const product = await prisma.product.create({
    data: {
      name,
      description: description || '',
      price: Number(price),
      sport,
      category,
      sizes: JSON.stringify(sizes),
      images: JSON.stringify(images || []),
      stock: JSON.stringify(stock || {}),
      active: active ?? true,
      featured: featured ?? false,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
