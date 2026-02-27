'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MyStorePage() {
  const router = useRouter()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [productForm, setProductForm] = useState({ name:'', description:'', price:'', stock:'', productType:'digital' })
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('products')

  useEffect(() => { fetchStore() }, [])

  const fetchStore = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    try {
      const res = await fetch('/api/store/my', { headers:{'Authorization':`Bearer ${token}`} })
      const data = await res.json()
      if (res.ok && data.store) {
        setStore(data.store)
        setProducts(data.store.products || [])
      } else {
        router.push('/dashboard/open-store')
      }
    } catch(e) {} finally { setLoading(false) }
  }

  const addProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/products', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ ...productForm, price: parseInt(productForm.price), stock: parseInt(productForm.stock) || 999 })
      })
      const data = await res.json()
      if (res.ok) {
        setProducts([...products, data.product])
        setProductForm({ name:'', description:'', price:'', stock:'', productType:'digital' })
        setShowAddProduct(false)
      } else { alert(data.error) }
    } catch(e) { alert('Gagal menambah produk') }
    finally { setSaving(false) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Hapus produk ini?')) return
    const token = localStorage.getItem('token')
    await fetch(`/api/products/${id}`, { method:'DELETE', headers:{'Authorization':`Bearer ${token}`} })
    setProducts(products.filter(p => p.id !== id))
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}><div style={{width:'36px',height:'36px',border:'3px solid rgba(167,139,250,0.2)',borderTop:'3px solid #a78bfa',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/></div>

  const inputStyle = {width:'100%',padding:'11px 14px',borderRadius:'10px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'14px',outline:'none',boxSizing:'border-box',marginBottom:'12px'}

  return (
    <div style={{padding:'20px 16px',paddingBottom:'90px'}}>
      {/* Store Header */}
      <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(91,33,182,0.2))',borderRadius:'20px',padding:'20px',border:'1px solid rgba(124,58,237,0.25)',marginBottom:'20px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20px',right:'-20px',width:'100px',height:'100px',background:'rgba(167,139,250,0.08)',borderRadius:'50%'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
              <div style={{width:'40px',height:'40px',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
              <div>
                <h1 style={{fontSize:'18px',fontWeight:'800',color:'white',margin:0}}>{store?.storeName}</h1>
                <span style={{fontSize:'11px',color:'#4ade80',fontWeight:'600'}}>Aktif</span>
              </div>
            </div>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',margin:'0 0 12px',lineHeight:'1.5'}}>{store?.storeDescription || 'Belum ada deskripsi'}</p>
          </div>
        </div>
        <div style={{display:'flex',gap:'16px'}}>
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:'20px',fontWeight:'900',color:'white',margin:0}}>{products.length}</p>
            <p style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0,textTransform:'uppercase',letterSpacing:'0.5px'}}>Produk</p>
          </div>
          <div style={{width:'1px',background:'rgba(255,255,255,0.1)'}}/>
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:'20px',fontWeight:'900',color:'white',margin:0}}>0</p>
            <p style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0,textTransform:'uppercase',letterSpacing:'0.5px'}}>Pesanan</p>
          </div>
          <div style={{width:'1px',background:'rgba(255,255,255,0.1)'}}/>
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:'20px',fontWeight:'900',color:'white',margin:0}}>Rp0</p>
            <p style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0,textTransform:'uppercase',letterSpacing:'0.5px'}}>Pendapatan</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'20px'}}>
        {['products','orders'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{padding:'8px 20px',borderRadius:'99px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'700',background: tab===t ? '#7c3aed' : 'rgba(255,255,255,0.06)',color: tab===t ? 'white' : 'rgba(255,255,255,0.5)',transition:'all 0.2s'}}>
            {t === 'products' ? 'Produk' : 'Pesanan Masuk'}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <button onClick={() => setShowAddProduct(!showAddProduct)} style={{width:'100%',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'white',padding:'13px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'700',marginBottom:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Produk
          </button>

          {showAddProduct && (
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'16px',padding:'20px',border:'1px solid rgba(255,255,255,0.1)',marginBottom:'16px'}}>
              <h3 style={{fontSize:'15px',fontWeight:'700',color:'white',marginBottom:'16px'}}>Produk Baru</h3>
              <form onSubmit={addProduct}>
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Nama Produk</label>
                <input style={inputStyle} placeholder="Nama produk" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required />
                
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Deskripsi</label>
                <textarea style={{...inputStyle,resize:'none'}} rows="3" placeholder="Deskripsi produk" value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}/>
                
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Harga (Rp)</label>
                    <input style={inputStyle} type="number" placeholder="50000" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} required />
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}}>Stok</label>
                    <input style={inputStyle} type="number" placeholder="999" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} />
                  </div>
                </div>

                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'8px'}}>Tipe Produk</label>
                <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
                  {['digital','physical'].map(t => (
                    <button key={t} type="button" onClick={() => setProductForm({...productForm,productType:t})} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'700',background: productForm.productType===t ? '#7c3aed' : 'rgba(255,255,255,0.06)',color: productForm.productType===t ? 'white' : 'rgba(255,255,255,0.5)'}}>
                      {t === 'digital' ? 'Digital' : 'Fisik'}
                    </button>
                  ))}
                </div>

                <div style={{display:'flex',gap:'10px'}}>
                  <button type="button" onClick={() => setShowAddProduct(false)} style={{flex:1,padding:'12px',borderRadius:'10px',background:'rgba(255,255,255,0.06)',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.6)',fontWeight:'700',fontSize:'14px'}}>Batal</button>
                  <button type="submit" disabled={saving} style={{flex:2,padding:'12px',borderRadius:'10px',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',border:'none',cursor:'pointer',color:'white',fontWeight:'700',fontSize:'14px',opacity:saving?0.7:1}}>
                    {saving ? 'Menyimpan...' : 'Simpan Produk'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
              <svg style={{margin:'0 auto 12px',display:'block'}} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              <p style={{fontSize:'14px'}}>Belum ada produk</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {products.map(p => (
                <div key={p.id} style={{background:'rgba(255,255,255,0.05)',borderRadius:'14px',padding:'14px',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{width:'48px',height:'48px',background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(91,33,182,0.2))',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg width="20" height="20" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:'14px',fontWeight:'700',color:'white',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                    <p style={{fontSize:'13px',color:'#a78bfa',fontWeight:'700',margin:'0 0 4px'}}>Rp{p.price.toLocaleString('id-ID')}</p>
                    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      <span style={{fontSize:'10px',background:'rgba(124,58,237,0.2)',color:'#a78bfa',padding:'2px 8px',borderRadius:'99px',fontWeight:'600'}}>{p.productType === 'digital' ? 'Digital' : 'Fisik'}</span>
                      <span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>Stok: {p.stock}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'8px',cursor:'pointer',color:'#f87171',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'orders' && (
        <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
          <svg style={{margin:'0 auto 12px',display:'block'}} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <p style={{fontSize:'14px'}}>Belum ada pesanan masuk</p>
        </div>
      )}
    </div>
  )
}
