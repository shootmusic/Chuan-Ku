import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  })
  return res.json()
}

async function sendDocument(chatId, fileUrl, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, document: fileUrl, caption, parse_mode: 'HTML' })
  })
}

async function sendPhoto(chatId, photoUrl, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl, caption, parse_mode: 'HTML' })
  })
}

export async function POST(request) {
  try {
    const { orderNumber, action, sellerChatId } = await request.json()

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { orderItems: { include: { product: true } }, store: true, user: true }
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    if (action === 'confirm') {
      await prisma.order.update({ where: { orderNumber }, data: { status: 'confirmed', confirmedAt: new Date() } })

      // Kirim produk digital ke buyer
      if (order.buyerTelegram) {
        const buyerChatId = order.buyerTelegram.startsWith('@') ? order.buyerTelegram : order.buyerTelegram

        await sendTelegram(buyerChatId,
          `<b>Pembayaran Dikonfirmasi!</b>\n\n` +
          `Order <code>${orderNumber}</code> kamu sudah dikonfirmasi penjual.\n` +
          `Produk kamu sedang dikirim...`
        )

        // Kirim tiap produk digital
        for (const item of order.orderItems) {
          if (item.product.productType === 'digital' && item.product.fileUrl) {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(item.product.fileName || '')
            const caption = `<b>${item.product.name}</b>\nOrder: <code>${orderNumber}</code>`

            if (isImage) {
              await sendPhoto(buyerChatId, item.product.fileUrl, caption)
            } else {
              await sendDocument(buyerChatId, item.product.fileUrl, caption)
            }
          }
        }

        await sendTelegram(buyerChatId, `Terima kasih sudah belanja di <b>${order.store.storeName}</b>! Semoga puas ya.`)
      }

      // Notif ke penjual
      if (order.store.telegramChatId) {
        await sendTelegram(order.store.telegramChatId,
          `Kamu sudah konfirmasi pesanan <code>${orderNumber}</code>.\nProduk digital sudah dikirim ke pembeli.`
        )
      }

    } else if (action === 'reject') {
      await prisma.order.update({ where: { orderNumber }, data: { status: 'rejected' } })

      if (order.buyerTelegram) {
        await sendTelegram(order.buyerTelegram,
          `Maaf, bukti pembayaran untuk order <code>${orderNumber}</code> ditolak penjual.\n` +
          `Silakan hubungi penjual untuk info lebih lanjut.`
        )
      }

      if (order.store.telegramChatId) {
        await sendTelegram(order.store.telegramChatId, `Kamu sudah menolak pesanan <code>${orderNumber}</code>.`)
      }
    }

    return NextResponse.json({ message: 'Success' })
  } catch (error) {
    console.error('Confirm error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
