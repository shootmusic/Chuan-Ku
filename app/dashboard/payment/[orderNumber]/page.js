'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Copy, Check, X } from 'lucide-react'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.orderNumber
  const [copied, setCopied] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('lastPaymentMethod') || 'qris'
    setPaymentMethod(saved)
    const lastOrder = localStorage.getItem('lastOrder')
    if (lastOrder) setOrder(JSON.parse(lastOrder))
  }, [])

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const renderPayment = (method) => {
    if (method === 'qris') {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-4">Scan QR Code pakai e-wallet atau mobile banking</p>
          <div className="flex justify-center mb-4">
            <img src="https://saweria.co/widgets/qr?streamKey=83100dfb5ad6f643d7a0776000a0eac6" alt="QRIS" className="w-52 h-52 bg-white p-2 rounded-xl" />
          </div>
        </div>
      )
    }
    if (method === 'saweria') {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-4">Klik tombol untuk bayar via Saweria</p>
          <a href="https://saweria.co/Kikomaukiko" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-3 inline-block">Buka Saweria</a>
        </div>
      )
    }
    if (method === 'gopay') {
      return (
        <div>
          <p className="text-sm text-gray-300 mb-3">Transfer ke nomor GoPay:</p>
          <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-400">GoPay</p>
              <p className="font-mono font-bold text-lg">081234567890</p>
              <p className="text-xs text-gray-400">a.n Chuanku</p>
            </div>
            <button onClick={() => copy('081234567890', 'gopay')} className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm">
              {copied === 'gopay' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )
    }
    if (method === 'bank') {
      return (
        <div>
          <p className="text-sm text-gray-300 mb-3">Transfer ke rekening:</p>
          <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-400">BCA</p>
              <p className="font-mono font-bold text-lg">1234567890</p>
              <p className="text-xs text-gray-400">a.n Chuanku</p>
            </div>
            <button onClick={() => copy('1234567890', 'bank')} className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm">
              {copied === 'bank' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )
    }
    if (method === 'va') {
      return (
        <div>
          <p className="text-sm text-gray-300 mb-3">Bayar via Virtual Account:</p>
          <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-400">Virtual Account BCA</p>
              <p className="font-mono font-bold text-lg">9881234567890</p>
            </div>
            <button onClick={() => copy('9881234567890', 'va')} className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm">
              {copied === 'va' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Pembayaran</h1>
            <button onClick={() => router.push('/dashboard/dashboard')} className="p-1 hover:bg-white/20 rounded">
              <X size={20} />
            </button>
          </div>
          <div className="bg-black/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-xs text-gray-400 mb-1">Order Number</p>
            <p className="font-mono font-bold text-yellow-300 text-lg">{orderNumber}</p>
            {order && (
              <p className="text-2xl font-bold mt-2">Rp{order.total?.toLocaleString('id-ID')}</p>
            )}
          </div>
          <div className="mb-6">
            {renderPayment(paymentMethod)}
          </div>
          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-200">Setelah bayar, screenshot bukti dan kirim ke @Chuangkubot di Telegram</p>
          </div>
          <button onClick={() => router.push('/dashboard/dashboard')} className="w-full btn-outline py-3">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
