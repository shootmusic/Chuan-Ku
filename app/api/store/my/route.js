import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const store = await prisma.store.findFirst({
      where: { userId: decoded.id },
      include: { products: { orderBy: { createdAt: 'desc' } } }
    })

    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    return NextResponse.json({ store })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
