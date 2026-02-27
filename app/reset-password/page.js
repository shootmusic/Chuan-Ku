'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Password tidak cocok'); return }
    if (form.password.length < 8) { setError('Password minimal 8 karakter'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password })
      })
      const data = await res.json()
      if (res.ok) { setDone(true) }
      else { setError(data.error || 'Gagal reset password') }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={{textAlign:'center'}}>
      <h3 style={{fontSize:'18px', fontWeight:'700', marginBottom:'10px'}}>Password Berhasil Diubah</h3>
      <p style={{fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'20px'}}>Silakan login dengan password baru kamu.</p>
      <Link href="/login?reset=true" style={{color:'#a78bfa', fontWeight:'700', textDecoration:'none'}}>Login Sekarang</Link>
    </div>
  )

  return (
    <>
      <h2 style={{fontSize:'22px', fontWeight:'800', marginBottom:'6px'}}>Reset Password</h2>
      <p style={{fontSize:'13px', color:'rgba(255,255,255,0.4)', marginBottom:'24px'}}>Buat password baru untuk akunmu.</p>
      {error && <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', padding:'11px 14px', borderRadius:'10px', marginBottom:'16px', fontSize:'13px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:'16px'}}>
          <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'7px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Password Baru</label>
          <input className="input-field" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
        </div>
        <div style={{marginBottom:'24px'}}>
          <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'7px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Konfirmasi Password</label>
          <input className="input-field" type="password" placeholder="Ulangi password" value={form.confirm} onChange={(e) => setForm({...form, confirm: e.target.value})} required />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'13px', fontSize:'14px', opacity: loading ? 0.7 : 1}}>
          {loading ? 'Menyimpan...' : 'Simpan Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{width:'100%', maxWidth:'400px'}}>
        <div style={{textAlign:'center', marginBottom:'28px'}}>
          <span style={{fontSize:'26px', fontWeight:'900', color:'white'}}>Chuàng Kù</span>
          <span style={{fontSize:'26px', fontWeight:'900', color:'#a78bfa', marginLeft:'6px'}}>创库</span>
        </div>
        <div className="card">
          <Suspense fallback={<p style={{textAlign:'center', color:'rgba(255,255,255,0.5)'}}>Loading...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
