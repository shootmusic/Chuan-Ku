'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchProducts(); fetchCartCount() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch(e) {} finally { setLoading(false) }
  }

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/cart/count', { headers:{ 'Authorization':`Bearer ${token}` } })
      const data = await res.json()
      setCartCount(data.count || 0)
    } catch(e) {}
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{padding:'20px 16px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <div>
          <h1 style={{fontSize:'22px', fontWeight:'800', color:'white', margin:0}}>Chuàng Kù <span style={{color:'#a78bfa'}}>创库</span></h1>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', margin:'2px 0 0'}}>Marketplace Digital</p>
        </div>
        <Link href="/dashboard/cart" style={{position:'relative', textDecoration:'none'}}>
          <div style={{width:'40px', height:'40px', background:'rgba(255,255,255,0.08)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.1)'}}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          </div>
          {cartCount > 0 && (
            <span style={{position:'absolute', top:'-6px', right:'-6px', background:'#7c3aed', color:'white', fontSize:'10px', fontWeight:'700', borderRadius:'99px', minWidth:'18px', height:'18px', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px'}}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div style={{position:'relative', marginBottom:'20px'}}>
        <svg style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)'}} width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          style={{width:'100%', padding:'11px 16px 11px 38px', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box'}}
        />
      </div>

      {loading ? (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{background:'rgba(255,255,255,0.05)', borderRadius:'14px', height:'200px', animation:'pulse 1.5s infinite'}}/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.4)'}}>
          <svg style={{margin:'0 auto 12px', display:'block'}} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <p style={{fontSize:'14px'}}>Produk tidak ditemukan</p>
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
          {filtered.map(product => <ProductCard key={product.id} product={product} onCartUpdate={fetchCartCount} />)}
        </div>
      )}
    </div>
  )
}
