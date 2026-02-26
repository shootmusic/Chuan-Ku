'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OpenStorePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    storeName: '',
    storeDescription: '',
    paymentMethods: ['qris', 'saweria', 'gopay', 'bank', 'va'],
    paymentDetails: {
      qris: '',
      saweria: '',
      gopay: '',
      bank: '',
      va: ''
    },
    telegramChatId: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: verifikasi
  
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }
  
  const handlePaymentDetailChange = (method, value) => {
    setForm({
      ...form,
      paymentDetails: {
        ...form.paymentDetails,
        [method]: value
      }
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStep(2)
        // Kirim email verifikasi
        await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email })
        })
      } else {
        alert('Gagal buka toko: ' + data.error)
      }
    } catch (error) {
      console.error('Error open store:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }
  
  if (step === 2) {
    return (
      <div className="p-4 text-center py-10">
        <div className="card">
          <span className="text-6xl mb-4 block">📧</span>
          <h1 className="text-2xl font-bold mb-4">Cek Email Kamu!</h1>
          <p className="text-gray-300 mb-6">
            Kami udah kirim link verifikasi ke <strong>{form.email}</strong>.<br />
            Klik link itu buat aktivasi toko kamu.
          </p>
          <p className="text-sm text-gray-400">
            Belum terima? Cek folder spam atau 
            <button className="text-yellow-300 ml-1" onClick={() => setStep(1)}>
              kirim ulang
            </button>
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Buka Toko</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card">
          <h2 className="font-bold mb-3">Informasi Toko</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Toko *</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi Toko</label>
              <textarea
                value={form.storeDescription}
                onChange={(e) => handleChange('storeDescription', e.target.value)}
                rows="3"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="font-bold mb-3">Detail Payment</h2>
          <p className="text-sm text-gray-300 mb-3">Isi sesuai metode yang kamu punya</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">QRIS (ID/URL)</label>
              <input
                type="text"
                value={form.paymentDetails.qris}
                onChange={(e) => handlePaymentDetailChange('qris', e.target.value)}
                placeholder="Contoh: 08123456789 atau https://..."
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Saweria (Stream Key/URL)</label>
              <input
                type="text"
                value={form.paymentDetails.saweria}
                onChange={(e) => handlePaymentDetailChange('saweria', e.target.value)}
                placeholder="Contoh: 83100dfb5ad6f..."
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">GoPay (Nomor)</label>
              <input
                type="text"
                value={form.paymentDetails.gopay}
                onChange={(e) => handlePaymentDetailChange('gopay', e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Transfer Bank (No Rek)</label>
              <input
                type="text"
                value={form.paymentDetails.bank}
                onChange={(e) => handlePaymentDetailChange('bank', e.target.value)}
                placeholder="BCA 123456789 a.n Chuàng Kù"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Virtual Account (Kode)</label>
              <input
                type="text"
                value={form.paymentDetails.va}
                onChange={(e) => handlePaymentDetailChange('va', e.target.value)}
                placeholder="Contoh: 988123456789"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="font-bold mb-3">Integrasi Telegram</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Telegram Chat ID *</label>
              <input
                type="text"
                value={form.telegramChatId}
                onChange={(e) => handleChange('telegramChatId', e.target.value)}
                placeholder="Contoh: 7710155531"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Chat @userinfobot di Telegram buat dapetin ID</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Verifikasi *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Contoh: tokosaya@gmail.com"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
                required
              />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Buat Toko Sekarang'}
        </button>
      </form>
    </div>
  )
}
