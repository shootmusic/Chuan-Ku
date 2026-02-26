import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const cart = await prisma.cart.findMany({
      where: { userId: decoded.id },
      include: {
        product: true
      }
    })
    
    return NextResponse.json({ cart })
    
  } catch (error) {
    console.error('Error fetch cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const { productId, quantity } = await request.json()
    
    // Cek existing cart
    const existing = await prisma.cart.findFirst({
      where: {
        userId: decoded.id,
        productId
      }
    })
    
    if (existing) {
      // Update quantity
      await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) }
      })
    } else {
      // Create new
      await prisma.cart.create({
        data: {
          userId: decoded.id,
          productId,
          quantity: quantity || 1
        }
      })
    }
    
    return NextResponse.json({ message: 'Added to cart' })
    
  } catch (error) {
    console.error('Error add to cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { cartId, quantity } = await request.json()
    
    await prisma.cart.update({
      where: { id: cartId },
      data: { quantity }
    })
    
    return NextResponse.json({ message: 'Cart updated' })
    
  } catch (error) {
    console.error('Error update cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { cartId } = await request.json()
    
    await prisma.cart.delete({
      where: { id: cartId }
    })
    
    return NextResponse.json({ message: 'Item removed' })
    
  } catch (error) {
    console.error('Error remove from cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
