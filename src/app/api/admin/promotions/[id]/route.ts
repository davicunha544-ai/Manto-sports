import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const promo = await prisma.promotion.update({
    where: { id },
    data: {
      title: body.title,
      subtitle: body.subtitle || null,
      image: body.image || null,
      link: body.link || null,
      color1: body.color1 || '#0a0a2e',
      color2: body.color2 || '#e63946',
      active: body.active ?? true,
      sortOrder: Number(body.sortOrder) || 0,
    },
  })

  return NextResponse.json(promo)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.promotion.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
