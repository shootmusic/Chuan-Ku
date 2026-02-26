// Ini untuk referensi, ga perlu di-run di Next.js
// Bot dijalankan via webhook di app/api/telegram/webhook

export const BOT_COMMANDS = [
  { command: 'start', description: 'Mulai bot' },
  { command: 'confirm', description: 'Konfirmasi pesanan (format: /confirm INV-XXX)' },
  { command: 'reject', description: 'Tolak pesanan (format: /reject INV-XXX)' },
  { command: 'mystore', description: 'Info toko kamu' },
  { command: 'orders', description: 'Lihat pesanan masuk' },
  { command: 'help', description: 'Bantuan' }
]

export const BOT_MESSAGES = {
  start: (username) => `Halo @${username}! Selamat datang di Chuàng Kù Bot.

Gue bakal notif kalo ada pembayaran masuk. Lu juga bisa:
/confirm [order_id] - Konfirmasi pesanan
/reject [order_id] - Tolak pesanan  
/mystore - Info toko lu
/orders - Lihat pesanan`,

  help: `*Chuàng Kù Bot Commands*
/start - Mulai bot
/confirm INV-XXX - Konfirmasi pesanan
/reject INV-XXX - Tolak pesanan
/mystore - Info toko kamu
/orders - Lihat pesanan masuk
/help - Bantuan ini`
}
