import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { storeName, storeDescription, paymentMethods, paymentDetails, telegramChatId, email } = await request.json()

    const existingStore = await prisma.store.findFirst({ where: { userId: decoded.id } })
    if (existingStore) return NextResponse.json({ error: 'Kamu sudah punya toko' }, { status: 400 })

    const store = await prisma.store.create({
      data: {
        userId: decoded.id,
        storeName,
        storeDescription,
        paymentMethods: JSON.stringify(paymentMethods),
        paymentDetails: JSON.stringify(paymentDetails),
        telegramChatId,
        isVerified: true
      }
    })

    return NextResponse.json({ message: 'Store created successfully', storeId: store.id })
  } catch (error) {
    console.error('Create store error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
