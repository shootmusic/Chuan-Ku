'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/login?registered=true')
      } else {
        setError(data.error || 'Registrasi gagal')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{fontSize:'24px', fontWeight:'800', textAlign:'center', marginBottom:'24px', color:'white'}}>Daftar Akun</h2>
      {error && (
        <div style={{background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.5)', color:'#fca5a5', padding:'12px', borderRadius:'10px', marginBottom:'16px', fontSize:'14px'}}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'13px', fontWeight:'600', marginBottom:'6px', color:'rgba(255,255,255,0.8)'}}>Username</label>
          <input className="input-field" type="text" placeholder="Pilih username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
        </div>
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'13px', fontWeight:'600', marginBottom:'6px', color:'rgba(255,255,255,0.8)'}}>Email</label>
          <input className="input-field" type="email" placeholder="Masukkan email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
        </div>
        <div style={{marginBottom:'24px'}}>
          <label style={{display:'block', fontSize:'13px', fontWeight:'600', marginBottom:'6px', color:'rgba(255,255,255,0.8)'}}>Password</label>
          <input className="input-field" type="password" placeholder="Buat password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'13px', fontSize:'15px', opacity: loading ? 0.6 : 1}}>
          {loading ? 'Loading...' : 'Daftar Sekarang'}
        </button>
      </form>
      <p style={{textAlign:'center', marginTop:'20px', fontSize:'14px', color:'rgba(255,255,255,0.6)'}}>
        Sudah punya akun?{' '}
        <Link href="/login" style={{color:'#ffd700', fontWeight:'600', textDecoration:'none'}}>Login</Link>
      </p>
    </div>
  )
}
