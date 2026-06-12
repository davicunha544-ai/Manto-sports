import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compareSync } from 'bcryptjs'
import { createAdminSession } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
  }

  const admin = await prisma.admin.findUnique({ where: { email } })

  if (!admin || !compareSync(password, admin.password)) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  await createAdminSession(admin.id)

  return NextResponse.json({ ok: true })
}
