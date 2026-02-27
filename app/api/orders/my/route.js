import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const orders = await prisma.order.findMany({
      where: { userId: decoded.id },
      include: { store: { select: { storeName: true } }, orderItems: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
