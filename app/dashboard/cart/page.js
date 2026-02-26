'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  
  useEffect(() => {
    fetchCart()
  }, [])
  
  const fetchCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    try {
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setCart(data.cart || [])
        calculateTotal(data.cart || [])
      }
    } catch (error) {
      console.error('Error fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    setTotal(sum)
  }
  
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, quantity: newQuantity })
      })
      
      if (res.ok) {
        const updatedCart = cart.map(item => 
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
        setCart(updatedCart)
        calculateTotal(updatedCart)
      }
    } catch (error) {
      console.error('Error update cart:', error)
    }
  }
  
  const removeItem = async (cartId) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId })
      })
      
      if (res.ok) {
        const updatedCart = cart.filter(item => item.id !== cartId)
        setCart(updatedCart)
        calculateTotal(updatedCart)
      }
    } catch (error) {
      console.error('Error remove item:', error)
    }
  }
  
  const handleCheckout = () => {
    router.push('/dashboard/checkout')
  }
  
  if (loading) return <div className="text-center py-10">Loading...</div>
  
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Keranjang</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-300 mb-4">Keranjang kosong</p>
          <Link href="/dashboard/dashboard" className="btn-primary">
            Belanja Yuk
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="card flex gap-3">
                <div className="w-16 h-16 bg-purple-800/50 rounded-lg flex items-center justify-center text-2xl">
                  {item.product.productType === 'digital' ? '📄' : '📦'}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold">{item.product.name}</h3>
                  <p className="text-sm text-gray-300">Rp{item.product.price.toLocaleString()}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-purple-800 rounded hover:bg-purple-700"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-purple-800 rounded hover:bg-purple-700"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-1 bg-red-800 rounded hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-black/80 backdrop-blur-lg border-t border-white/20">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold">Total:</span>
              <span className="text-xl font-bold text-yellow-300">Rp{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full btn-primary py-3"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
