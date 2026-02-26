// Handler untuk berbagai command bot Telegram
// Ini dipanggil dari webhook route

export async function handleStart(chatId, username) {
  const message = `Halo @${username}! Selamat datang di Chuàng Kù Bot.

Gue bakal notif kalo ada pembayaran masuk. Lu juga bisa:
/confirm [order_id] - Konfirmasi pesanan
/reject [order_id] - Tolak pesanan
/mystore - Info toko lu
/orders - Lihat pesanan
/help - Bantuan`

  return await sendTelegramMessage(chatId, message)
}

export async function handleConfirm(chatId, orderNumber) {
  if (!orderNumber) {
    return await sendTelegramMessage(chatId, 'Format: /confirm INV-XXX')
  }
  
  try {
    // Proses konfirmasi order
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
      
      // Kirim produk digital
      for (const item of order.items) {
        if (item.product.productType === 'digital' && item.product.filePath) {
          await sendTelegramMessage(
            order.user.telegramUsername || chatId,
            `🎁 Produk digital untuk order ${orderNumber}:\n${item.product.filePath}`
          )
        }
      }
      
      return true
    } else {
      await sendTelegramMessage(chatId, `❌ Order ${orderNumber} ga ditemukan`)
      return false
    }
  } catch (error) {
    console.error('Confirm error:', error)
    await sendTelegramMessage(chatId, `❌ Gagal konfirmasi order ${orderNumber}`)
    return false
  }
}

export async function handleReject(chatId, orderNumber) {
  if (!orderNumber) {
    return await sendTelegramMessage(chatId, 'Format: /reject INV-XXX')
  }
  
  try {
    await prisma.order.update({
      where: { orderNumber },
      data: { paymentStatus: 'rejected' }
    })
    
    await sendTelegramMessage(chatId, `❌ Order ${orderNumber} ditolak.`)
    return true
  } catch (error) {
    console.error('Reject error:', error)
    await sendTelegramMessage(chatId, `❌ Gagal menolak order ${orderNumber}`)
    return false
  }
}

export async function handleMyStore(chatId) {
  try {
    const store = await prisma.store.findFirst({
      where: { telegramChatId: chatId.toString() }
    })
    
    if (store) {
      const paymentMethods = JSON.parse(store.paymentMethods || '[]')
      const methods = paymentMethods.map(m => `• ${m}`).join('\n')
      
      const message = `🏪 *${store.storeName}*
${store.storeDescription || 'Ga ada deskripsi'}

✅ Verified: ${store.isVerified ? 'Ya' : 'Belum'}
💳 Payment: 
${methods || 'Belum diatur'}

Total produk: (fitur menyusul)`
      
      await sendTelegramMessage(chatId, message)
    } else {
      await sendTelegramMessage(chatId,
        `Lu belum punya toko. Buka toko dulu di website Chuàng Kù!`
      )
    }
  } catch (error) {
    console.error('MyStore error:', error)
    await sendTelegramMessage(chatId, 'Gagal mengambil info toko')
  }
}

export async function handleOrders(chatId) {
  try {
    // Cari store berdasarkan chatId
    const store = await prisma.store.findFirst({
      where: { telegramChatId: chatId.toString() }
    })
    
    if (!store) {
      return await sendTelegramMessage(chatId, 'Lu belum punya toko.')
    }
    
    // Ambil orders pending
    const orders = await prisma.order.findMany({
      where: { 
        storeId: store.id,
        paymentStatus: 'pending'
      },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    if (orders.length === 0) {
      return await sendTelegramMessage(chatId, 'Belum ada pesanan pending.')
    }
    
    let message = `📦 *Pesanan Pending (${orders.length}):*\n\n`
    
    orders.forEach((order, i) => {
      message += `${i+1}. *${order.orderNumber}*\n`
      message += `   👤 @${order.user.username}\n`
      message += `   💰 Rp${order.totalAmount.toLocaleString()}\n`
      message += `   ⏰ ${new Date(order.createdAt).toLocaleString('id-ID')}\n`
      message += `   /confirm ${order.orderNumber} | /reject ${order.orderNumber}\n\n`
    })
    
    await sendTelegramMessage(chatId, message)
    
  } catch (error) {
    console.error('Orders error:', error)
    await sendTelegramMessage(chatId, 'Gagal mengambil daftar pesanan')
  }
}

export async function handleHelp(chatId) {
  const message = `*Chuàng Kù Bot Commands*

/start - Mulai bot
/confirm INV-XXX - Konfirmasi pesanan
/reject INV-XXX - Tolak pesanan
/mystore - Info toko kamu
/orders - Lihat pesanan masuk
/help - Bantuan ini

Butuh bantuan? Chat @chuangkubot`
  
  await sendTelegramMessage(chatId, message)
}

// Helper function (akan di-import dari lib/telegram)
import { sendTelegramMessage } from '@/lib/telegram'
import { prisma } from '@/lib/prisma'
