'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const addToCart = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      })

      if (res.ok) {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card hover:scale-105 transition-transform cursor-pointer">
      <div className="aspect-square bg-purple-800/50 rounded-lg mb-3 flex items-center justify-center text-4xl">
        {product.productType === 'digital' ? '📄' : '📦'}
      </div>

      <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-xs text-gray-300 mb-3 line-clamp-2">{product.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-yellow-300 font-bold text-sm">
          Rp{product.price.toLocaleString('id-ID')}
        </span>
        <button
          onClick={addToCart}
          disabled={loading}
          className={`p-2 rounded-full transition-all ${added ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
        </button>
      </div>

      {product.store && (
        <p className="text-xs text-gray-400 mt-2">🏪 {product.store.storeName}</p>
      )}
    </div>
  )
}
