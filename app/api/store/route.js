import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const stores = await prisma.store.findMany({
      include: { products: true }
    })
    return NextResponse.json({ stores })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { storeName, description, telegramChatId } = await request.json()
    const existing = await prisma.store.findFirst({ where: { userId: decoded.id } })
    if (existing) return NextResponse.json({ error: 'Sudah punya toko' }, { status: 400 })
    const store = await prisma.store.create({
      data: { storeName, description, telegramChatId: String(telegramChatId), userId: decoded.id }
    })
    return NextResponse.json({ store }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { storeName, description, saweriaUrl, qrisUrl, gopayNumber, bankAccount, bankName } = await request.json()
    const store = await prisma.store.update({
      where: { userId: decoded.id },
      data: {
        ...(storeName && { storeName }),
        ...(description !== undefined && { description }),
        ...(saweriaUrl !== undefined && { saweriaUrl }),
        ...(qrisUrl !== undefined && { qrisUrl }),
        ...(gopayNumber !== undefined && { gopayNumber }),
        ...(bankAccount !== undefined && { bankAccount }),
        ...(bankName !== undefined && { bankName }),
      }
    })
    return NextResponse.json({ store })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
