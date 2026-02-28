import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

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

    // Handle callback (konfirmasi/reject dari penjual)
    if (body.callback_query) {
      const data = body.callback_query.data
      const callbackChatId = body.callback_query.from.id

      if (data.startsWith('confirm_') || data.startsWith('reject_')) {
        const action = data.startsWith('confirm_') ? 'confirm' : 'reject'
        const orderNumber = data.replace('confirm_', '').replace('reject_', '')

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chuangku.ricossh.cloud'
        await fetch(`${baseUrl}/api/orders/confirm`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ orderNumber, action, sellerChatId: callbackChatId })
        })

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            callback_query_id: body.callback_query.id,
            text: action === 'confirm' ? 'Pesanan dikonfirmasi!' : 'Pesanan ditolak'
          })
        })
      }
      return NextResponse.json({ ok: true })
    }

    const message = body.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat.id
    const text = message.text || ''
    const fromUsername = message.from?.username
    const fromId = message.from?.id
    const fromFirstName = message.from?.first_name || 'Kawan'

    // Handle /start
    if (text === '/start') {
      const usernameText = fromUsername ? `@${fromUsername}` : `ID: ${fromId}`
      await sendTelegram(chatId,
        `Halo, <b>${fromFirstName}</b>! 👋\n\n` +
        `Selamat datang di <b>Chuàng Kù</b> — Marketplace Digital.\n\n` +
        `Info akun kamu:\n` +
        `• Nama: <b>${fromFirstName}</b>\n` +
        `• Username: <b>${usernameText}</b>\n` +
        `• Telegram ID: <code>${fromId}</code>\n\n` +
        `Gunakan ID <code>${fromId}</code> saat checkout untuk menerima produk via Telegram.\n\n` +
        `Belanja sekarang di:\n<b>chuangku.ricossh.cloud</b>\n\n` +
        `Jika sudah bayar, kirim screenshot bukti pembayaran ke sini ya!`
      )
      return NextResponse.json({ ok: true })
    }

    // Handle /id - cek ID telegram
    if (text === '/id') {
      const usernameText = fromUsername ? `@${fromUsername}` : 'tidak ada'
      await sendTelegram(chatId,
        `Info Telegram kamu:\n\n` +
        `• Nama: <b>${fromFirstName}</b>\n` +
        `• Username: <b>${usernameText}</b>\n` +
        `• Telegram ID: <code>${fromId}</code>\n\n` +
        `Gunakan ID <code>${fromId}</code> saat checkout.`
      )
      return NextResponse.json({ ok: true })
    }

    // Handle bukti pembayaran (foto/dokumen)
    if (message.photo || message.document) {
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
        await sendTelegram(chatId,
          `Hmm, gue tidak menemukan pesanan pending dari kamu.\n\n` +
          `Pastikan kamu sudah checkout di website dan masukkan:\n` +
          `• Username: <b>${fromUsername ? '@'+fromUsername : '-'}</b>\n` +
          `• Atau ID: <code>${fromId}</code>`
        )
        return NextResponse.json({ ok: true })
      }

      const order = pendingOrders[0]
      const fileId = message.photo ? message.photo[message.photo.length-1].file_id : message.document?.file_id
      const fileType = message.photo ? 'photo' : 'document'

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentProof: fileId, status: 'waiting_confirmation' }
      })

      await sendTelegram(chatId,
        `Bukti pembayaran diterima!\n\n` +
        `Order: <code>${order.orderNumber}</code>\n` +
        `Total: <b>Rp${order.totalAmount.toLocaleString('id-ID')}</b>\n\n` +
        `Penjual sedang mengecek pembayaranmu. Harap tunggu konfirmasi ya, <b>${fromFirstName}</b>!`
      )

      if (order.store.telegramChatId) {
        const productList = order.orderItems.map(i => `• ${i.product.name} x${i.quantity}`).join('\n')
        const caption =
          `<b>Bukti Pembayaran Masuk!</b>\n\n` +
          `Order: <code>${order.orderNumber}</code>\n` +
          `Pembeli: <b>${fromFirstName}</b> (${fromUsername ? '@'+fromUsername : 'no username'})\n` +
          `Telegram ID: <code>${fromId}</code>\n\n` +
          `<b>Produk:</b>\n${productList}\n\n` +
          `<b>Total: Rp${order.totalAmount.toLocaleString('id-ID')}</b>\n` +
          `Metode: ${order.paymentMethod?.toUpperCase()}\n\n` +
          `Cek apakah pembayaran sudah masuk:`

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

    // Cek order number di pesan
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
      `Halo <b>${fromFirstName}</b>!\n\n` +
      `Kirimkan bukti pembayaran (screenshot) ke sini setelah melakukan pembayaran.\n\n` +
      `Info akun kamu:\n` +
      `• ID: <code>${fromId}</code>\n` +
      `• Username: ${fromUsername ? '@'+fromUsername : 'tidak ada'}\n\n` +
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
