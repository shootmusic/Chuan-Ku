'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    
    Promise.all([
      fetch('/api/auth/me', { headers:{'Authorization':`Bearer ${token}`} }).then(r => r.json()),
      fetch('/api/store/my', { headers:{'Authorization':`Bearer ${token}`} }).then(r => r.json())
    ]).then(([userData, storeData]) => {
      if (userData.user) setUser(userData.user)
      else { localStorage.removeItem('token'); router.push('/login'); return }
      if (storeData.store) setStore(storeData.store)
    }).finally(() => setLoading(false))
  }, [])

  const logout = () => { localStorage.removeItem('token'); window.location.href = '/login' }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}>
      <div style={{width:'36px',height:'36px',border:'3px solid rgba(167,139,250,0.2)',borderTop:'3px solid #a78bfa',borderRadius:'50%'}}/>
    </div>
  )

  const initial = user?.username?.charAt(0).toUpperCase()

  return (
    <div style={{padding:'0 0 80px'}}>
      {/* Header Banner */}
      <div style={{height:'120px',background:'linear-gradient(135deg,#2d0070,#6b21a8,#4c0099)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20px',right:'-20px',width:'120px',height:'120px',background:'rgba(167,139,250,0.1)',borderRadius:'50%'}}/>
      </div>

      <div style={{padding:'0 20px',marginTop:'-36px',marginBottom:'20px',position:'relative',zIndex:1}}>
        <div style={{width:'72px',height:'72px',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:'900',color:'white',border:'3px solid #1a0533',boxShadow:'0 8px 24px rgba(124,58,237,0.4)'}}>
          {initial}
        </div>
      </div>

      <div style={{padding:'0 20px'}}>
        <h1 style={{fontSize:'22px',fontWeight:'900',color:'white',margin:'0 0 2px'}}>{user?.username}</h1>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',margin:'0 0 20px'}}>{user?.email}</p>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'24px'}}>
          {[
            {label:'Member Sejak', value: new Date(user?.createdAt).toLocaleDateString('id-ID',{month:'short',year:'numeric'})},
            {label:'Pesanan', value:'0'},
            {label:'Toko', value: store ? '1' : '0'},
          ].map(s => (
            <div key={s.label} style={{background:'rgba(255,255,255,0.05)',borderRadius:'14px',padding:'14px',border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
              <p style={{fontSize:'16px',fontWeight:'800',color:'white',margin:'0 0 4px'}}>{s.value}</p>
              <p style={{fontSize:'10px',color:'rgba(255,255,255,0.35)',margin:0,textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {/* Toko Saya - kalau sudah punya toko */}
          {store ? (
            <Link href="/dashboard/my-store" style={{textDecoration:'none'}}>
              <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',padding:'16px',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'14px'}}>
                <div style={{width:'44px',height:'44px',background:'rgba(167,139,250,0.15)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#a78bfa',flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:'14px',fontWeight:'700',color:'white',margin:'0 0 2px'}}>{store.storeName}</p>
                  <p style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',margin:0}}>Kelola produk dan pesanan</p>
                </div>
                <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard/open-store" style={{textDecoration:'none'}}>
              <div style={{background:'rgba(52,211,153,0.05)',borderRadius:'16px',padding:'16px',border:'1px solid rgba(52,211,153,0.15)',display:'flex',alignItems:'center',gap:'14px'}}>
                <div style={{width:'44px',height:'44px',background:'rgba(52,211,153,0.15)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#34d399',flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:'14px',fontWeight:'700',color:'#34d399',margin:'0 0 2px'}}>Buka Toko</p>
                  <p style={{fontSize:'12px',color:'rgba(52,211,153,0.5)',margin:0}}>Mulai jualan di Chuàng Kù</p>
                </div>
                <svg width="16" height="16" fill="none" stroke="rgba(52,211,153,0.3)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
          )}

          <Link href="/dashboard/orders" style={{textDecoration:'none'}}>
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',padding:'16px',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{width:'44px',height:'44px',background:'rgba(96,165,250,0.15)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#60a5fa',flexShrink:0}}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:'14px',fontWeight:'700',color:'white',margin:'0 0 2px'}}>Pesanan Saya</p>
                <p style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',margin:0}}>Riwayat transaksi pembelian</p>
              </div>
              <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </Link>

          <button onClick={logout} style={{background:'rgba(239,68,68,0.06)',borderRadius:'16px',padding:'16px',border:'1px solid rgba(239,68,68,0.12)',display:'flex',alignItems:'center',gap:'14px',cursor:'pointer',width:'100%',textAlign:'left'}}>
            <div style={{width:'44px',height:'44px',background:'rgba(239,68,68,0.12)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#f87171',flexShrink:0}}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <div>
              <p style={{fontSize:'14px',fontWeight:'700',color:'#f87171',margin:'0 0 2px'}}>Logout</p>
              <p style={{fontSize:'12px',color:'rgba(239,68,68,0.4)',margin:0}}>Keluar dari akun</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
