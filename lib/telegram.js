const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID

export async function sendTelegramMessage(chatId, text, keyboard = null) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    ...(keyboard && { reply_markup: JSON.stringify(keyboard) })
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return await response.json()
  } catch (error) {
    console.error('Telegram error:', error)
    return null
  }
}

export async function sendPaymentNotification(order, user, store, items) {
  const orderNumber = order.orderNumber
  const total = order.totalAmount
  const username = user.username
  const storeName = store?.storeName || 'Chuàng Kù Official'
  
  let itemsList = ''
  items.forEach(item => {
    itemsList += `  • ${item.product.name} (${item.quantity}x) Rp${item.priceAtTime.toLocaleString()}\n`
  })
  
  const message = `
✧˖°. CHUÀNG KÙ PAYMENT .°˖✧
┌──────────────────────┐
│  💰 PEMBAYARAN DITERIMA
└──────────────────────┘
        · · ────── · ·
◈ Order  : ${orderNumber}
◈ Customer: @${username}
◈ Toko   : ${storeName}
        · · ────── · ·
📦 PRODUK:
${itemsList}
        · · ────── · ·
💸 TOTAL: Rp${total.toLocaleString()}
📆 Waktu: ${new Date().toLocaleString('id-ID')}
        · · ────── · ·
⚡️ KONFIRMASI:
  [✓] /confirm ${orderNumber}
  [✗] /reject ${orderNumber}
`
  
  await sendTelegramMessage(OWNER_CHAT_ID, message)
  
  if (store?.telegramChatId && store.telegramChatId !== OWNER_CHAT_ID) {
    await sendTelegramMessage(store.telegramChatId, message)
  }
}

export async function sendProductToCustomer(order, user, items) {
  for (const item of items) {
    if (item.product.productType === 'digital' && item.product.filePath) {
      await sendTelegramMessage(user.telegramUsername || OWNER_CHAT_ID, 
        `🎁 Produk digital untuk order ${order.orderNumber}:\n${item.product.filePath}`)
    }
  }
}
