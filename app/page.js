import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-black/30 backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-white">Chuàng Kù 创库</h1>
        <div className="space-x-4">
          <Link href="/login">
            <button className="btn-outline">Login</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary">Daftar</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Marketplace <span className="text-yellow-300">Digital</span> Auto Payment
        </h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl">
          Jual apapun, dapatkan pembayaran otomatis via Telegram. Digital atau fisik, semua bisa!
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <button className="btn-primary text-lg px-8 py-3">Mulai Jualan</button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-outline text-lg px-8 py-3">Lihat Demo</button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 p-12 max-w-6xl mx-auto">
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-2">Auto Payment</h3>
          <p className="text-gray-200">QRIS, Gopay, VA, Saweria auto integrate dengan notifikasi Telegram</p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-2">Telegram Notif</h3>
          <p className="text-gray-200">Notifikasi realtime + konfirmasi via bot, ga perlu ngecek dashboard mulu</p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-2">Multi Store</h3>
          <p className="text-gray-200">Buka toko sendiri dengan payment method masing-masing</p>
        </div>
      </div>
    </div>
  )
}
