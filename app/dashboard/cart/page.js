'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    try {
      const res = await fetch('/api/cart', { headers:{'Authorization':`Bearer ${token}`} })
      const data = await res.json()
      if (res.ok) setCart(data.cart || [])
    } catch(e) {} finally { setLoading(false) }
  }

  const total = cart.reduce((acc, i) => acc + (i.product.price * i.quantity), 0)

  const updateQty = async (cartId, qty) => {
    if (qty < 1) return
    await fetch('/api/cart', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({cartId, quantity:qty}) })
    setCart(cart.map(i => i.id === cartId ? {...i, quantity:qty} : i))
  }

  const removeItem = async (cartId) => {
    await fetch('/api/cart', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({cartId}) })
    setCart(cart.filter(i => i.id !== cartId))
  }

  if (loading) return <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh'}}><div style={{width:'32px', height:'32px', border:'3px solid rgba(167,139,250,0.3)', borderTop:'3px solid #a78bfa', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/></div>

  return (
    <div style={{padding:'24px 16px', paddingBottom:'140px'}}>
      <h1 style={{fontSize:'20px', fontWeight:'800', marginBottom:'20px', color:'white'}}>Keranjang</h1>

      {cart.length === 0 ? (
        <div style={{textAlign:'center', padding:'60px 20px'}}>
          <svg style={{margin:'0 auto 16px', display:'block', color:'rgba(255,255,255,0.15)'}} width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          <p style={{color:'rgba(255,255,255,0.35)', fontSize:'14px', marginBottom:'20px'}}>Keranjang masih kosong</p>
          <Link href="/dashboard/dashboard" style={{background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'white', padding:'12px 28px', borderRadius:'10px', textDecoration:'none', fontWeight:'700', fontSize:'14px'}}>Mulai Belanja</Link>
        </div>
      ) : (
        <>
          <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'16px'}}>
            {cart.map(item => (
              <div key={item.id} style={{background:'rgba(255,255,255,0.06)', borderRadius:'14px', padding:'14px', border:'1px solid rgba(255,255,255,0.09)', display:'flex', gap:'12px', alignItems:'center'}}>
                <div style={{width:'48px', height:'48px', background:'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(91,33,182,0.2))', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <p style={{fontSize:'13px', fontWeight:'700', color:'white', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.product.name}</p>
                  <p style={{fontSize:'13px', color:'#a78bfa', fontWeight:'700', margin:'0 0 8px'}}>Rp{item.product.price.toLocaleString('id-ID')}</p>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <button onClick={() => updateQty(item.id, item.quantity-1)} style={{width:'28px', height:'28px', borderRadius:'8px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', color:'white', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>-</button>
                    <span style={{fontSize:'14px', fontWeight:'700', color:'white', minWidth:'24px', textAlign:'center'}}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity+1)} style={{width:'28px', height:'28px', borderRadius:'8px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', color:'white', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center'}}>+</button>
                  </div>
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px'}}>
                  <p style={{fontSize:'13px', fontWeight:'800', color:'white', margin:0}}>Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                  <button onClick={() => removeItem(item.id)} style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'#f87171', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{position:'fixed', bottom:'64px', left:0, right:0, padding:'16px', background:'rgba(15,5,35,0.95)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.5)'}}>Total ({cart.length} item)</span>
              <span style={{fontSize:'18px', fontWeight:'900', color:'white'}}>Rp{total.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={() => router.push('/dashboard/checkout')} style={{width:'100%', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'white', padding:'14px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'15px', fontWeight:'700', letterSpacing:'0.3px'}}>
              Lanjut Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
