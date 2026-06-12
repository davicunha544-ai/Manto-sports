import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const promotions = await prisma.promotion.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(promotions)
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, subtitle, image, link, color1, color2, active, sortOrder } = body

  const promo = await prisma.promotion.create({
    data: {
      title,
      subtitle: subtitle || null,
      image: image || null,
      link: link || null,
      color1: color1 || '#0a0a2e',
      color2: color2 || '#e63946',
      active: active ?? true,
      sortOrder: Number(sortOrder) || 0,
    },
  })

  return NextResponse.json(promo, { status: 201 })
}
