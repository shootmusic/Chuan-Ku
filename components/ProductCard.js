'use client'
import { useState } from 'react'

export default function ProductCard({ product, onCartUpdate }) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const addToCart = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) { window.location.href = '/login'; return }
      const res = await fetch('/api/cart', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      })
      if (res.ok) {
        setAdded(true)
        if (onCartUpdate) onCartUpdate()
        setTimeout(() => setAdded(false), 2000)
      }
    } catch(e) {} finally { setLoading(false) }
  }

  return (
    <div style={{background:'rgba(255,255,255,0.06)', borderRadius:'14px', padding:'14px', border:'1px solid rgba(255,255,255,0.09)', transition:'transform 0.2s', cursor:'pointer'}}>
      <div style={{aspectRatio:'1', background:'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(91,33,182,0.2))', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px', border:'1px solid rgba(124,58,237,0.2)'}}>
        <svg width="32" height="32" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" viewBox="0 0 24 24">
          {product.productType === 'digital'
            ? <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>
            : <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></>
          }
        </svg>
      </div>
      <div style={{fontSize:'11px', color:'rgba(167,139,250,0.7)', fontWeight:'600', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.5px'}}>
        {product.productType === 'digital' ? 'Digital' : 'Fisik'}
      </div>
      <h3 style={{fontSize:'13px', fontWeight:'700', color:'white', marginBottom:'4px', lineHeight:'1.3', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{product.name}</h3>
      <p style={{fontSize:'11px', color:'rgba(255,255,255,0.35)', marginBottom:'10px', lineHeight:'1.4', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{product.description}</p>
      {product.store && <p style={{fontSize:'10px', color:'rgba(255,255,255,0.3)', marginBottom:'10px'}}>by {product.store.storeName}</p>}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'14px', fontWeight:'800', color:'#a78bfa'}}>Rp{product.price.toLocaleString('id-ID')}</span>
        <button onClick={addToCart} disabled={loading}
          style={{width:'32px', height:'32px', borderRadius:'8px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', background: added ? 'rgba(34,197,94,0.2)' : 'rgba(124,58,237,0.3)', transition:'all 0.2s'}}>
          {added
            ? <svg width="16" height="16" fill="none" stroke="#86efac" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          }
        </button>
      </div>
    </div>
  )
}
