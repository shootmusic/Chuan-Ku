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
        window.location.href = '/login?registered=true'
      } else {
        setError(data.error || 'Registrasi gagal')
      }
    } catch {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{fontSize:'22px', fontWeight:'800', textAlign:'center', marginBottom:'6px', color:'white'}}>Buat Akun</h2>
      <p style={{textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:'13px', marginBottom:'24px'}}>Daftar dan mulai jualan sekarang</p>

      {error && (
        <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', padding:'11px 14px', borderRadius:'10px', marginBottom:'16px', fontSize:'13px'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'7px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Username</label>
          <input className="input-field" type="text" placeholder="Pilih username unik" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
        </div>
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'7px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Email</label>
          <input className="input-field" type="email" placeholder="email@kamu.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
        </div>
        <div style={{marginBottom:'24px'}}>
          <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'7px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Password</label>
          <input className="input-field" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength={8} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'13px', fontSize:'14px', opacity: loading ? 0.7 : 1}}>
          {loading ? 'Memproses...' : 'Buat Akun'}
        </button>
      </form>

      <div style={{textAlign:'center', marginTop:'20px', fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>
        Sudah punya akun?{' '}
        <Link href="/login" style={{color:'#a78bfa', fontWeight:'700', textDecoration:'none'}}>Login</Link>
      </div>
    </div>
  )
}
