import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const store = await prisma.store.findFirst({ where: { userId: decoded.id } })
    if (!store) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.product.delete({ where: { id: parseInt(params.id), storeId: store.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
