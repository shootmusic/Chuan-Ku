import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ count: 0 })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ count: 0 })
    }
    
    const cartItems = await prisma.cart.findMany({
      where: { userId: decoded.id }
    })
    
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    
    return NextResponse.json({ count })
    
  } catch (error) {
    console.error('Cart count error:', error)
    return NextResponse.json({ count: 0 })
  }
}
