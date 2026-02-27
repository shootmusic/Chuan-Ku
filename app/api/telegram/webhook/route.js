import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID

async function sendTelegram(chatId, text, extra = {}) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra })
  })
}

async function forwardPhoto(chatId, fileId, caption, extra = {}) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, photo: fileId, caption, parse_mode: 'HTML', ...extra })
  })
}

async function forwardDocument(chatId, fileId, caption, extra = {}) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: chatId, document: fileId, caption, parse_mode: 'HTML', ...extra })
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const message = body.message || body.callback_query?.message

    // Handle callback (konfirmasi/reject dari penjual)
    if (body.callback_query) {
      const data = body.callback_query.data
      const callbackChatId = body.callback_query.from.id

      if (data.startsWith('confirm_') || data.startsWith('reject_')) {
        const action = data.startsWith('confirm_') ? 'confirm' : 'reject'
        const orderNumber = data.replace('confirm_', '').replace('reject_', '')

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chuangku.up.railway.app'
        await fetch(`${baseUrl}/api/orders/confirm`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ orderNumber, action, sellerChatId: callbackChatId })
        })

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ callback_query_id: body.callback_query.id, text: action === 'confirm' ? 'Pesanan dikonfirmasi!' : 'Pesanan ditolak' })
        })
      }
      return NextResponse.json({ ok: true })
    }

    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text = message.text || ''
    const fromUsername = message.from?.username
    const fromId = message.from?.id

    // Handle /start
    if (text === '/start') {
      await sendTelegram(chatId,
        `Halo! Selamat datang di <b>Chuàng Kù Bot</b>\n\n` +
        `Gue akan bantu proses pembayaran dan pengiriman produk kamu.\n\n` +
        `Untuk melanjutkan pesanan, silakan checkout di:\n` +
        `<b>chuangku.ricossh.cloud</b>`
      )
      return NextResponse.json({ ok: true })
    }

    // Handle bukti pembayaran (foto/dokumen)
    if (message.photo || message.document) {
      // Cari order pending dari user ini berdasarkan telegram username/id
      const buyerTelegram = fromUsername ? `@${fromUsername}` : `${fromId}`
      
      const pendingOrders = await prisma.order.findMany({
        where: {
          status: 'pending',
          OR: [
            { buyerTelegram: buyerTelegram },
            { buyerTelegram: `${fromId}` },
            { buyerTelegram: fromUsername ? `@${fromUsername}` : '' }
          ]
        },
        include: { store: true, orderItems: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: 1
      })

      if (pendingOrders.length === 0) {
        await sendTelegram(chatId, 'Hmm, gue tidak menemukan pesanan pending dari kamu. Pastikan kamu sudah checkout di website dan masukkan username Telegram kamu dengan benar.')
        return NextResponse.json({ ok: true })
      }

      const order = pendingOrders[0]
      const fileId = message.photo ? message.photo[message.photo.length-1].file_id : message.document?.file_id
      const fileType = message.photo ? 'photo' : 'document'

      // Simpan bukti pembayaran
      await prisma.order.update({ where: { id: order.id }, data: { paymentProof: fileId, status: 'waiting_confirmation' } })

      // Konfirmasi ke buyer
      await sendTelegram(chatId,
        `Bukti pembayaran diterima!\n\n` +
        `Order: <code>${order.orderNumber}</code>\n` +
        `Total: <b>Rp${order.totalAmount.toLocaleString('id-ID')}</b>\n\n` +
        `Penjual sedang mengecek pembayaranmu. Harap tunggu konfirmasi.`
      )

      // Forward ke penjual dengan tombol konfirmasi
      if (order.store.telegramChatId) {
        const productList = order.orderItems.map(i => `• ${i.product.name} x${i.quantity}`).join('\n')
        const caption =
          `<b>Bukti Pembayaran Masuk!</b>\n\n` +
          `Order: <code>${order.orderNumber}</code>\n` +
          `Pembeli: @${fromUsername || fromId}\n` +
          `Telegram ID: <code>${fromId}</code>\n\n` +
          `<b>Produk:</b>\n${productList}\n\n` +
          `<b>Total: Rp${order.totalAmount.toLocaleString('id-ID')}</b>\n` +
          `Metode: ${order.paymentMethod?.toUpperCase()}\n\n` +
          `Cek apakah pembayaran sudah masuk, lalu konfirmasi:`

        const keyboard = {
          inline_keyboard: [[
            { text: 'Konfirmasi Pembayaran', callback_data: `confirm_${order.orderNumber}` },
            { text: 'Tolak', callback_data: `reject_${order.orderNumber}` }
          ]]
        }

        if (fileType === 'photo') {
          await forwardPhoto(order.store.telegramChatId, fileId, caption, { reply_markup: keyboard })
        } else {
          await forwardDocument(order.store.telegramChatId, fileId, caption, { reply_markup: keyboard })
        }
      }

      return NextResponse.json({ ok: true })
    }

    // Pesan teks biasa — cek apakah ada order number di pesan
    const orderMatch = text.match(/CK\w+/i)
    if (orderMatch) {
      const orderNumber = orderMatch[0].toUpperCase()
      const order = await prisma.order.findUnique({ where: { orderNumber } })
      if (order) {
        await sendTelegram(chatId,
          `Status Order <code>${orderNumber}</code>:\n` +
          `Status: <b>${order.status}</b>\n` +
          `Total: Rp${order.totalAmount.toLocaleString('id-ID')}`
        )
        return NextResponse.json({ ok: true })
      }
    }

    // Default reply
    await sendTelegram(chatId,
      `Halo! Kirimkan bukti pembayaran (screenshot) ke sini setelah melakukan pembayaran.\n\n` +
      `Atau kunjungi <b>chuangku.ricossh.cloud</b> untuk belanja.`
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: true })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook active' })
}
