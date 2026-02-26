'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      })
      
      if (res.ok) {
        alert('Produk ditambahkan ke cart!')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }
  
  return (
    <div className="card hover:scale-105 transition-transform">
      <div className="aspect-square bg-purple-800/50 rounded-lg mb-3 flex items-center justify-center">
        {product.productType === 'digital' ? '📄' : '📦'}
      </div>
      
      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
      <p className="text-sm text-gray-300 mb-2 line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-yellow-300 font-bold">Rp{product.price.toLocaleString()}</span>
        <button 
          onClick={addToCart}
          className="bg-purple-600 p-2 rounded-full hover:bg-purple-700"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  )
}
