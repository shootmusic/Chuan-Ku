import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage, sendProductToCustomer } from '@/lib/telegram'

export async function POST(request) {
  try {
    const update = await request.json()
    
    if (update.message) {
      const chatId = update.message.chat.id
      const text = update.message.text
      const username = update.message.from.username || 'unknown'
      
      if (text === '/start') {
        await sendTelegramMessage(chatId, 
          `Halo @${username}! Selamat datang di Chuàng Kù Bot.\n\n` +
          `Gue bakal notif kalo ada pembayaran masuk. Lu juga bisa:\n` +
          `/confirm [order_id] - Konfirmasi pesanan\n` +
          `/reject [order_id] - Tolak pesanan\n` +
          `/mystore - Info toko lu\n` +
          `/orders - Lihat pesanan`
        )
      }
      
      else if (text.startsWith('/confirm')) {
        const orderNumber = text.split(' ')[1]
        if (!orderNumber) {
          await sendTelegramMessage(chatId, 'Format: /confirm INV-XXX')
          return NextResponse.json({ ok: true })
        }
        
        const order = await prisma.order.update({
          where: { orderNumber },
          data: { paymentStatus: 'confirmed', confirmedAt: new Date() },
          include: { 
            user: true,
            items: { include: { product: true } }
          }
        })
        
        if (order) {
          await sendTelegramMessage(chatId, `✅ Order ${orderNumber} telah dikonfirmasi!`)
          await sendProductToCustomer(order, order.user, order.items)
          await sendTelegramMessage(
            order.user.telegramUsername || chatId,
            `🎉 Order ${orderNumber} lu udah dikonfirmasi! Cek produknya ya.`
          )
        } else {
          await sendTelegramMessage(chatId, `❌ Order ${orderNumber} ga ditemukan`)
        }
      }
      
      else if (text.startsWith('/reject')) {
        const orderNumber = text.split(' ')[1]
        if (!orderNumber) {
          await sendTelegramMessage(chatId, 'Format: /reject INV-XXX')
          return NextResponse.json({ ok: true })
        }
        
        await prisma.order.update({
          where: { orderNumber },
          data: { paymentStatus: 'rejected' }
        })
        
        await sendTelegramMessage(chatId, `❌ Order ${orderNumber} ditolak.`)
      }
      
      else if (text === '/mystore') {
        const store = await prisma.store.findFirst({
          where: { telegramChatId: chatId.toString() }
        })
        
        if (store) {
          await sendTelegramMessage(chatId,
            `🏪 *${store.storeName}*\n` +
            `${store.storeDescription || 'Ga ada deskripsi'}\n\n` +
            `Verified: ${store.isVerified ? '✅' : '❌'}\n` +
            `Produk: (fitur menyusul)`
          )
        } else {
          await sendTelegramMessage(chatId,
            `Lu belum punya toko. Buka toko dulu di website Chuàng Kù!`
          )
        }
      }
    }
    
    return NextResponse.json({ ok: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: true })
  }
}
