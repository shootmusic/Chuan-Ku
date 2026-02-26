'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function PaymentModal({ isOpen, onClose, order, paymentMethod }) {
  const [copied, setCopied] = useState(false)
  
  if (!isOpen) return null
  
  const getPaymentInstructions = () => {
    switch(paymentMethod) {
      case 'qris':
        return {
          title: 'QRIS',
          instruction: 'Scan QR code di bawah ini menggunakan aplikasi e-wallet atau mobile banking kamu.',
          qrUrl: process.env.NEXT_PUBLIC_SAWERIA_QR_URL
        }
      case 'saweria':
        return {
          title: 'Saweria',
          instruction: 'Klik link berikut untuk membayar via Saweria:',
          link: process.env.NEXT_PUBLIC_SAWERIA_PAGE_URL
        }
      case 'gopay':
        return {
          title: 'GoPay',
          instruction: 'Transfer ke nomor GoPay berikut:',
          number: '0812-3456-7890' // Contoh
        }
      case 'bank':
        return {
          title: 'Transfer Bank',
          instruction: 'Transfer ke rekening berikut:',
          details: 'BCA 1234567890 a.n Chuàng Kù'
        }
      case 'va':
        return {
          title: 'Virtual Account',
          instruction: 'Gunakan nomor VA berikut:',
          number: '9881234567890'
        }
      default:
        return {}
    }
  }
  
  const instructions = getPaymentInstructions()
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-purple-900 p-4 flex justify-between items-center border-b border-white/20">
          <h2 className="text-xl font-bold">Pembayaran {instructions.title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-300 mb-2">
              Rp{order?.totalAmount?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-300">Order: {order?.orderNumber}</p>
          </div>
          
          <div className="card bg-white/10">
            <p className="text-sm mb-3">{instructions.instruction}</p>
            
            {instructions.qrUrl && (
              <div className="flex justify-center mb-3">
                <img 
                  src={instructions.qrUrl} 
                  alt="QRIS" 
                  className="w-48 h-48 bg-white p-2 rounded-lg"
                />
              </div>
            )}
            
            {instructions.link && (
              <a 
                href={instructions.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center btn-primary py-2 mb-3"
              >
                Buka Link Pembayaran
              </a>
            )}
            
            {instructions.number && (
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg mb-3">
                <span className="font-mono">{instructions.number}</span>
                <button 
                  onClick={() => copyToClipboard(instructions.number)}
                  className="text-sm bg-purple-600 px-3 py-1 rounded hover:bg-purple-700"
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            )}
            
            {instructions.details && (
              <div className="bg-black/30 p-3 rounded-lg mb-3">
                <p className="font-mono text-sm">{instructions.details}</p>
              </div>
            )}
          </div>
          
          <div className="card bg-yellow-600/20 border border-yellow-500">
            <p className="text-sm">
              ⚠️ Setelah melakukan pembayaran, screenshot bukti bayar dan kirim ke 
              <a href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`} className="text-yellow-300 ml-1">
                @{process.env.NEXT_PUBLIC_BOT_USERNAME}
              </a>
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full btn-outline py-2"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
