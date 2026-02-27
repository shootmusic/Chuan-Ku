'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) {
        setSent(true)
      } else {
        setError(data.error || 'Gagal mengirim email')
      }
    } catch {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{width:'100%', maxWidth:'400px'}}>
        <div style={{textAlign:'center', marginBottom:'28px'}}>
          <span style={{fontSize:'26px', fontWeight:'900', color:'white'}}>Chuàng Kù</span>
          <span style={{fontSize:'26px', fontWeight:'900', color:'#a78bfa', marginLeft:'6px'}}>创库</span>
        </div>

        <div className="card">
          {sent ? (
            <div style={{textAlign:'center'}}>
              <div style={{width:'56px', height:'56px', background:'rgba(124,58,237,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'24px'}}>
                <svg width="24" height="24" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3 style={{fontSize:'18px', fontWeight:'700', marginBottom:'10px'}}>Email Terkirim</h3>
              <p style={{fontSize:'13px', color:'rgba(255,255,255,0.5)', lineHeight:'1.6', marginBottom:'20px'}}>
                Link reset password sudah dikirim ke <strong style={{color:'white'}}>{email}</strong>. Cek inbox atau folder spam kamu.
              </p>
              <Link href="/login" style={{color:'#a78bfa', fontWeight:'700', textDecoration:'none', fontSize:'14px'}}>Kembali ke Login</Link>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:'22px', fontWeight:'800', marginBottom:'6px', color:'white'}}>Lupa Password</h2>
              <p style={{fontSize:'13px', color:'rgba(255,255,255,0.4)', marginBottom:'24px', lineHeight:'1.5'}}>
                Masukkan email kamu dan kami akan kirim link untuk reset password.
              </p>

              {error && (
                <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', padding:'11px 14px', borderRadius:'10px', marginBottom:'16px', fontSize:'13px'}}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{marginBottom:'20px'}}>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'7px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Email</label>
                  <input className="input-field" type="email" placeholder="email@kamu.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'13px', fontSize:'14px', opacity: loading ? 0.7 : 1}}>
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>

              <div style={{textAlign:'center', marginTop:'20px', fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>
                <Link href="/login" style={{color:'#a78bfa', fontWeight:'700', textDecoration:'none'}}>Kembali ke Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
