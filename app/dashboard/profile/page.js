'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchUser()
  }, [])
  
  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setUser(data.user)
      } else {
        localStorage.removeItem('token')
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetch user:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  if (loading) return <div className="text-center py-10">Loading...</div>
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="card mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-300">{user?.email}</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="text-sm text-gray-300">Member sejak: {new Date(user?.createdAt).toLocaleDateString('id-ID')}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Link href="/dashboard/open-store" className="block card hover:bg-white/20 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏪</span>
            <div>
              <h3 className="font-bold">Buka Toko</h3>
              <p className="text-sm text-gray-300">Mulai jualan di Chuàng Kù</p>
            </div>
          </div>
        </Link>
        
        <Link href="/dashboard/orders" className="block card hover:bg-white/20 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <h3 className="font-bold">Pesanan Saya</h3>
              <p className="text-sm text-gray-300">Lihat riwayat pesanan</p>
            </div>
          </div>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full card hover:bg-red-500/20 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚪</span>
            <div>
              <h3 className="font-bold text-red-300">Logout</h3>
              <p className="text-sm text-gray-300">Keluar dari akun</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
