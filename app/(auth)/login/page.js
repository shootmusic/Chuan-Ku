'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('token', data.token)
        router.push('/dashboard/dashboard')
      } else {
        setError(data.error || 'Login gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-3xl font-bold text-center mb-8">Login ke Chuàng Kù</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-white"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      
      <p className="text-center mt-4">
        Belum punya akun?{' '}
        <Link href="/register" className="text-yellow-300 hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  )
}
