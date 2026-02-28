'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      if (res.ok) setProduct(data.product)
    } catch(e) {} finally { setLoading(false) }
  }

  const addToCart = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    setAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ productId: parseInt(id), quantity: 1 })
      })
      if (res.ok) router.push('/dashboard/cart')
      else { const d = await res.json(); alert(d.error) }
    } catch(e) {} finally { setAdding(false) }
  }

  const buyNow = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    setAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ productId: parseInt(id), quantity: 1 })
      })
      if (res.ok) router.push('/dashboard/checkout')
    } catch(e) {} finally { setAdding(false) }
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0f0520'}}><div style={{width:'32px',height:'32px',border:'3px solid rgba(167,139,250,0.3)',borderTop:'3px solid #a78bfa',borderRadius:'50%'}}/></div>

  if (!product) return <div style={{textAlign:'center',padding:'60px',color:'white'}}>Produk tidak ditemukan</div>

  return (
    <div style={{background:'#0f0520',minHeight:'100vh',paddingBottom:'100px'}}>
      {/* Back button */}
      <div style={{padding:'16px',display:'flex',alignItems:'center',gap:'12px'}}>
        <button onClick={() => router.back()} style={{background:'rgba(255,255,255,0.07)',border:'none',borderRadius:'10px',width:'38px',height:'38px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style={{fontSize:'16px',fontWeight:'700',color:'white',margin:0}}>Detail Produk</h2>
      </div>

      {/* Image */}
      <div style={{margin:'0 16px',borderRadius:'20px',overflow:'hidden',aspectRatio:'1',background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(91,33,182,0.1))',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
        {product.imageUrl ? (
          <img src={product.imageUrl} style={{width:'100%',height:'100%',objectFit:'cover'}} alt={product.name}/>
        ) : (
          <svg width="80" height="80" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        )}
      </div>

      {/* Info */}
      <div style={{padding:'0 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
          <span style={{fontSize:'11px',background:'rgba(124,58,237,0.2)',color:'#a78bfa',padding:'3px 10px',borderRadius:'99px',fontWeight:'600'}}>{product.productType === 'digital' ? 'Produk Digital' : 'Produk Fisik'}</span>
          {product.productType === 'digital' && <span style={{fontSize:'11px',background:'rgba(52,211,153,0.15)',color:'#4ade80',padding:'3px 10px',borderRadius:'99px',fontWeight:'600'}}>Pengiriman Instan</span>}
        </div>

        <h1 style={{fontSize:'20px',fontWeight:'900',color:'white',marginBottom:'8px'}}>{product.name}</h1>
        <p style={{fontSize:'26px',fontWeight:'900',color:'#a78bfa',marginBottom:'16px'}}>Rp{product.price.toLocaleString('id-ID')}</p>

        {product.description && (
          <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',padding:'16px',marginBottom:'16px',border:'1px solid rgba(255,255,255,0.07)'}}>
            <h3 style={{fontSize:'13px',fontWeight:'700',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'8px'}}>Deskripsi</h3>
            <p style={{fontSize:'14px',color:'rgba(255,255,255,0.8)',lineHeight:'1.6',margin:0}}>{product.description}</p>
          </div>
        )}

        <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',padding:'16px',marginBottom:'20px',border:'1px solid rgba(255,255,255,0.07)'}}>
          <h3 style={{fontSize:'13px',fontWeight:'700',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'12px'}}>Info Produk</h3>
          {[
            {label:'Tipe',value:product.productType === 'digital' ? 'Digital' : 'Fisik'},
            {label:'Stok',value:product.stock > 100 ? 'Tersedia' : `${product.stock} tersisa`},
            {label:'Toko',value:product.store?.storeName || '-'},
          ].map(item => (
            <div key={item.label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <span style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>{item.label}</span>
              <span style={{fontSize:'13px',fontWeight:'600',color:'white'}}>{item.value}</span>
            </div>
          ))}
          {product.productType === 'digital' && (
            <div style={{marginTop:'12px',padding:'10px',background:'rgba(124,58,237,0.1)',borderRadius:'10px',border:'1px solid rgba(124,58,237,0.2)'}}>
              <p style={{fontSize:'12px',color:'#c4b5fd',margin:0}}>Produk digital akan dikirim otomatis via Telegram setelah pembayaran dikonfirmasi penjual.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,padding:'12px 16px',background:'rgba(15,5,32,0.95)',backdropFilter:'blur(10px)',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:'10px'}}>
        <button onClick={addToCart} disabled={adding} style={{flex:1,padding:'14px',borderRadius:'12px',background:'rgba(124,58,237,0.15)',border:'1px solid rgba(124,58,237,0.3)',cursor:'pointer',color:'#a78bfa',fontSize:'14px',fontWeight:'700'}}>
          + Keranjang
        </button>
        <button onClick={buyNow} disabled={adding} style={{flex:2,padding:'14px',borderRadius:'12px',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',border:'none',cursor:'pointer',color:'white',fontSize:'14px',fontWeight:'700'}}>
          Beli Sekarang
        </button>
      </div>
    </div>
  )
}
