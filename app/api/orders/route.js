import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function generateOrderNumber() {
  return 'CK' + Date.now() + Math.random().toString(36).substr(2,4).toUpperCase()
}

async function sendTelegram(chatId, text, extra = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra })
  })
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { paymentMethod, buyerTelegram, buyerPhone, buyerEmail, notes, cartItems } = await request.json()

    if (!cartItems || cartItems.length === 0) return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 })

    const storeId = cartItems[0].product.storeId
    const store = await prisma.store.findUnique({ where: { id: storeId }, include: { user: true } })
    const buyer = await prisma.user.findUnique({ where: { id: decoded.id } })

    const totalAmount = cartItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0)
    const orderNumber = generateOrderNumber()
    const hasDigital = cartItems.some(i => i.product.productType === 'digital')

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: decoded.id,
        storeId,
        totalAmount,
        status: 'pending',
        paymentMethod,
        buyerTelegram,
        buyerPhone,
        buyerEmail,
        notes,
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
    await prisma.cart.deleteMany({ where: { userId: decoded.id } })

    // Kirim pesan ke buyer via Telegram
    if (buyerTelegram) {
      const buyerChatId = buyerTelegram.startsWith('@') ? buyerTelegram : buyerTelegram.replace('@','')
      const productList = cartItems.map(i => `• ${i.product.name} x${i.quantity} = Rp${(i.product.price*i.quantity).toLocaleString('id-ID')}`).join('\n')

      await sendTelegram(buyerChatId,
        `🛍 <b>Pesanan Baru dari Chuàng Kù</b>\n\n` +
        `Order ID: <code>${orderNumber}</code>\n\n` +
        `<b>Produk:</b>\n${productList}\n\n` +
        `<b>Total: Rp${totalAmount.toLocaleString('id-ID')}</b>\n` +
        `<b>Pembayaran via:</b> ${paymentMethod.toUpperCase()}\n\n` +
        `Jika sudah membayar, kirimkan screenshot/bukti transfer ke sini ya! ` +
        `Sertakan Order ID <code>${orderNumber}</code> di pesanmu.`
      )
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
