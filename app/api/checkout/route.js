import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { sendPaymentNotification } from '@/lib/telegram'

function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `INV-${year}${month}${day}-${random}`
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
    
    const { paymentMethod, items } = await request.json()
    
    // Hitung total
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.price * item.quantity
    }
    
    // Ambil storeId dari produk pertama (asumsi 1 toko)
    const firstProduct = await prisma.product.findUnique({
      where: { id: items[0].productId }
    })
    
    if (!firstProduct) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })
    }
    
    // Buat order
    const orderNumber = generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: decoded.id,
        storeId: firstProduct.storeId,
        totalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.price
          }))
        }
      },
      include: {
        user: true,
        store: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    // Hapus cart
    await prisma.cart.deleteMany({
      where: { userId: decoded.id }
    })
    
    // Kirim notifikasi ke Telegram
    await sendPaymentNotification(order, order.user, order.store, order.items)
    
    return NextResponse.json({ 
      message: 'Checkout berhasil', 
      orderNumber: order.orderNumber 
    })
    
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
