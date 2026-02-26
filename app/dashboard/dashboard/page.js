'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  
  useEffect(() => {
    fetchProducts()
    fetchCartCount()
  }, [])
  
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetch products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart/count')
      const data = await res.json()
      setCartCount(data.count || 0)
    } catch (error) {
      console.error('Error fetch cart count:', error)
    }
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/dashboard/cart" className="relative">
          <ShoppingCart size={28} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
