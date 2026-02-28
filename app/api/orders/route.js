import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function generateOrderNumber() {
  return 'CK' + Date.now() + Math.random().toString(36).substr(2,4).toUpperCase()
}

async function sendTelegram(chatId, text, extra = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra })
    })
  } catch(e) { console.error('Telegram error:', e.message) }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { paymentMethod, buyerTelegram, buyerPhone, buyerEmail, notes, cartItems } = await request.json()

    if (!cartItems || cartItems.length === 0) return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 })

    const storeId = cartItems[0].product.storeId
    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store) return NextResponse.json({ error: 'Toko tidak ditemukan' }, { status: 404 })

    const totalAmount = cartItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0)
    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: decoded.id,
        storeId,
        totalAmount,
        status: 'pending',
        paymentMethod,
        buyerTelegram: buyerTelegram || null,
        buyerPhone: buyerPhone || null,
        buyerEmail: buyerEmail || null,
        notes: notes || null,
        orderItems: {
          create: cartItems.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price
          }))
        }
      },
      include: { orderItems: { include: { product: true } } }
    })

    // Hapus cart
    try { await prisma.cart.deleteMany({ where: { userId: decoded.id } }) } catch(e) {}

    // Kirim pesan ke buyer via Telegram
    if (buyerTelegram) {
      const productList = cartItems.map(i => `• ${i.product.name} x${i.quantity}`).join('\n')
      await sendTelegram(buyerTelegram,
        `Halo! Pesanan baru dari <b>Chuàng Kù</b>\n\n` +
        `Order ID: <code>${orderNumber}</code>\n\n` +
        `<b>Produk:</b>\n${productList}\n\n` +
        `<b>Total: Rp${totalAmount.toLocaleString('id-ID')}</b>\n` +
        `Pembayaran via: <b>${paymentMethod?.toUpperCase()}</b>\n\n` +
        `Jika sudah membayar, kirim screenshot bukti pembayaran ke bot ini ya!`
      )
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
