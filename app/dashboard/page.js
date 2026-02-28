'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => { fetchProducts(); fetchCartCount() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (res.ok) setProducts(data.products || [])
    } catch(e) {} finally { setLoading(false) }
  }

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('/api/cart', { headers:{'Authorization':`Bearer ${token}`} })
      const data = await res.json()
      if (res.ok) setCartCount(data.cart?.length || 0)
    } catch(e) {}
  }

  const addToCart = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ productId, quantity: 1 })
      })
      if (res.ok) { setCartCount(c => c+1); alert('Ditambahkan ke keranjang!') }
    } catch(e) {}
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{background:'#0f0520',minHeight:'100vh',paddingBottom:'80px'}}>
      {/* Header */}
      <div style={{padding:'16px',paddingTop:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'rgba(15,5,32,0.95)',backdropFilter:'blur(10px)',zIndex:10,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div>
          <h1 style={{fontSize:'18px',fontWeight:'900',color:'white',margin:0}}>Chuàng Kù <span style={{color:'#a78bfa'}}>创库</span></h1>
          <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',margin:0}}>Marketplace Digital</p>
        </div>
        <Link href="/dashboard/cart" style={{textDecoration:'none',position:'relative'}}>
          <div style={{width:'40px',height:'40px',background:'rgba(255,255,255,0.07)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span style={{position:'absolute',top:'-4px',right:'-4px',background:'#7c3aed',color:'white',fontSize:'10px',fontWeight:'700',width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{cartCount}</span>}
          </div>
        </Link>
      </div>

      {/* Search */}
      <div style={{padding:'12px 16px'}}>
        <div style={{position:'relative'}}>
          <svg style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)'}} width="16" height="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari produk..." style={{width:'100%',padding:'10px 12px 10px 36px',borderRadius:'12px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.08)',color:'white',fontSize:'14px',outline:'none',boxSizing:'border-box'}}/>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div style={{width:'32px',height:'32px',border:'3px solid rgba(167,139,250,0.3)',borderTop:'3px solid #a78bfa',borderRadius:'50%'}}/></div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:'60px 20px',color:'rgba(255,255,255,0.3)'}}>
          <svg style={{margin:'0 auto 12px',display:'block'}} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p style={{fontSize:'14px'}}>Produk tidak ditemukan</p>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',padding:'4px 16px'}}>
          {filtered.map(p => (
            <Link key={p.id} href={`/dashboard/product/${p.id}`} style={{textDecoration:'none'}}>
              <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)',transition:'transform 0.2s',cursor:'pointer'}}>
                {/* Thumbnail */}
                <div style={{width:'100%',aspectRatio:'1',background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(91,33,182,0.1))',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} style={{width:'100%',height:'100%',objectFit:'cover'}} alt={p.name}/>
                  ) : (
                    <svg width="40" height="40" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  )}
                </div>
                {/* Info */}
                <div style={{padding:'10px'}}>
                  <span style={{fontSize:'10px',background:'rgba(124,58,237,0.2)',color:'#a78bfa',padding:'2px 7px',borderRadius:'99px',fontWeight:'600'}}>{p.productType === 'digital' ? 'Digital' : 'Fisik'}</span>
                  <p style={{fontSize:'13px',fontWeight:'700',color:'white',margin:'6px 0 4px',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{p.name}</p>
                  <p style={{fontSize:'14px',fontWeight:'900',color:'#a78bfa',margin:'0 0 8px'}}>Rp{p.price.toLocaleString('id-ID')}</p>
                  <button onClick={(e) => addToCart(e, p.id)} style={{width:'100%',padding:'8px',borderRadius:'8px',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',border:'none',cursor:'pointer',color:'white',fontSize:'12px',fontWeight:'700'}}>
                    + Keranjang
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
