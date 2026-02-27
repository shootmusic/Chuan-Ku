'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch('/api/auth/me', { headers:{ 'Authorization':`Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if(d.user) setUser(d.user); else { localStorage.removeItem('token'); router.push('/login') } })
      .finally(() => setLoading(false))
  }, [])

  const logout = () => { localStorage.removeItem('token'); window.location.href = '/login' }

  if (loading) return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh'}}>
      <div style={{width:'32px', height:'32px', border:'3px solid rgba(167,139,250,0.3)', borderTop:'3px solid #a78bfa', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/>
    </div>
  )

  const initial = user?.username?.charAt(0).toUpperCase()

  return (
    <div style={{padding:'24px 16px'}}>
      <h1 style={{fontSize:'20px', fontWeight:'800', marginBottom:'24px', color:'white'}}>Profile</h1>

      <div style={{background:'rgba(255,255,255,0.06)', borderRadius:'16px', padding:'20px', border:'1px solid rgba(255,255,255,0.09)', marginBottom:'16px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px'}}>
          <div style={{width:'56px', height:'56px', background:'linear-gradient(135deg, #7c3aed, #a78bfa)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'800', color:'white', flexShrink:0}}>
            {initial}
          </div>
          <div>
            <h2 style={{fontSize:'18px', fontWeight:'800', color:'white', margin:'0 0 2px'}}>{user?.username}</h2>
            <p style={{fontSize:'13px', color:'rgba(255,255,255,0.45)', margin:0}}>{user?.email}</p>
          </div>
        </div>
        <div style={{background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'10px 14px', fontSize:'12px', color:'rgba(255,255,255,0.35)'}}>
          Member sejak {new Date(user?.createdAt).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
        {[
          { href:'/dashboard/open-store', label:'Buka Toko', desc:'Mulai jualan di Chuàng Kù', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> },
          { href:'/dashboard/orders', label:'Pesanan Saya', desc:'Riwayat transaksi', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{textDecoration:'none'}}>
            <div style={{background:'rgba(255,255,255,0.06)', borderRadius:'14px', padding:'16px', border:'1px solid rgba(255,255,255,0.09)', display:'flex', alignItems:'center', gap:'14px', transition:'background 0.2s'}}>
              <div style={{width:'40px', height:'40px', background:'rgba(124,58,237,0.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#a78bfa', flexShrink:0}}>
                {item.icon}
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:'14px', fontWeight:'700', color:'white', margin:'0 0 2px'}}>{item.label}</p>
                <p style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', margin:0}}>{item.desc}</p>
              </div>
              <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </Link>
        ))}

        <button onClick={logout} style={{background:'rgba(239,68,68,0.08)', borderRadius:'14px', padding:'16px', border:'1px solid rgba(239,68,68,0.15)', display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', width:'100%', textAlign:'left', transition:'background 0.2s'}}>
          <div style={{width:'40px', height:'40px', background:'rgba(239,68,68,0.15)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#f87171', flexShrink:0}}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <div>
            <p style={{fontSize:'14px', fontWeight:'700', color:'#f87171', margin:'0 0 2px'}}>Logout</p>
            <p style={{fontSize:'12px', color:'rgba(239,68,68,0.5)', margin:0}}>Keluar dari akun</p>
          </div>
        </button>
      </div>
    </div>
  )
}
