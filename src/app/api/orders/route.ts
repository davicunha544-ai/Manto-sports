import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { customerName, email, phone, address, city, state, zipCode, total, items } = body

  if (!customerName || !email || !address || !city || !state || !zipCode || !items?.length) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      email,
      phone: phone || '',
      address,
      city,
      state,
      zipCode,
      total,
      status: 'pending',
      items: {
        create: items.map((item: { productId: string; size: string; quantity: number; price: number }) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  })

  return NextResponse.json(order, { status: 201 })
}
