import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">Chuàng Kù 创库</h1>
        <div className="flex gap-3">
          <Link href="/login">
            <button className="btn-outline text-sm py-2 px-5">Login</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary text-sm py-2 px-5">Daftar</button>
          </Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-block bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-sm px-4 py-1 rounded-full mb-6">
          Auto Payment via Telegram Bot
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Marketplace Digital<br />
          <span className="text-yellow-300">Auto Payment</span>
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-xl">
          Jual apapun, dapatkan pembayaran otomatis via Telegram. Digital atau fisik, semua bisa!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register">
            <button className="btn-primary text-base px-8 py-3">Mulai Jualan</button>
          </Link>
          <Link href="/dashboard/dashboard">
            <button className="btn-outline text-base px-8 py-3">Lihat Demo</button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 px-6 pb-20 max-w-5xl mx-auto">
        <div className="card text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-xl font-bold mb-2">Auto Payment</h3>
          <p className="text-white/60 text-sm">QRIS, Gopay, VA, Saweria auto integrate dengan notifikasi Telegram</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-xl font-bold mb-2">Telegram Notif</h3>
          <p className="text-white/60 text-sm">Notifikasi realtime + konfirmasi via bot, ga perlu ngecek dashboard</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-3">🏪</div>
          <h3 className="text-xl font-bold mb-2">Multi Store</h3>
          <p className="text-white/60 text-sm">Buka toko sendiri dengan payment method masing-masing</p>
        </div>
      </div>
    </div>
  )
}
