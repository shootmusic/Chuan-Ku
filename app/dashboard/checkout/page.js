'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [processing, setProcessing] = useState(false)

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: '📱' },
    { id: 'saweria', name: 'Saweria', icon: '🎯' },
    { id: 'gopay', name: 'GoPay', icon: '💚' },
    { id: 'bank', name: 'Transfer Bank', icon: '🏦' },
    { id: 'va', name: 'Virtual Account', icon: '🔢' }
  ]

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }

    try {
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setCart(data.cart || [])
        const sum = (data.cart || []).reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
        setTotal(sum)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod,
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('lastPaymentMethod', paymentMethod)
        localStorage.setItem('lastOrder', JSON.stringify({ total }))

        if (paymentMethod === 'saweria') {
          window.open('https://saweria.co/Kikomaukiko', '_blank')
          router.push(`/dashboard/payment/${data.orderNumber}`)
        } else {
          router.push(`/dashboard/payment/${data.orderNumber}`)
        }
      } else {
        alert('Checkout gagal: ' + data.error)
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center py-20">
        <p className="text-gray-300 mb-4">Keranjang kosong</p>
        <Link href="/dashboard/dashboard" className="btn-primary px-6 py-2">Belanja Yuk</Link>
      </div>
    )
  }

  return (
    <div className="p-4 pb-32">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="card mb-4">
        <h2 className="font-bold mb-3">Ringkasan Belanja</h2>
        <div className="space-y-2 mb-3">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product.name} x{item.quantity}</span>
              <span>Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/20 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-yellow-300 text-lg">Rp{total.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold mb-3">Metode Pembayaran</h2>
        <div className="space-y-2">
          {paymentMethods.map(method => (
            <label key={method.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'bg-purple-600/40 border border-purple-400' : 'bg-white/5 hover:bg-white/10'}`}>
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-2xl">{method.icon}</span>
              <span className="font-medium">{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-black/80 backdrop-blur-lg border-t border-white/20">
        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full btn-primary py-3 text-lg disabled:opacity-50"
        >
          {processing ? '⏳ Memproses...' : '💳 Bayar Sekarang'}
        </button>
      </div>
    </div>
  )
}
