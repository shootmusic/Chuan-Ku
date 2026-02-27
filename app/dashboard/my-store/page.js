'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function MyStorePage() {
  const router = useRouter()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState({ name:'', description:'', price:'', stock:'999', productType:'digital', fileUrl:'', fileName:'', filePublicId:'', imageUrl:'' })
  const fileRef = useRef()
  const imageRef = useRef()

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

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
          body: JSON.stringify({ file: base64, fileName: file.name, type })
        })
        const data = await res.json()
        if (res.ok) {
          if (type === 'product') {
            setForm(f => ({...f, fileUrl: data.url, fileName: file.name, filePublicId: data.publicId}))
          } else {
            setForm(f => ({...f, imageUrl: data.url}))
          }
        } else { alert('Upload gagal: ' + data.error) }
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch(e) { alert('Upload error'); setUploading(false) }
  }

  const addProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({...form, price: parseInt(form.price), stock: parseInt(form.stock) || 999})
      })
      const data = await res.json()
      if (res.ok) {
        setProducts([data.product, ...products])
        setForm({ name:'', description:'', price:'', stock:'999', productType:'digital', fileUrl:'', fileName:'', filePublicId:'', imageUrl:'' })
        setShowAdd(false)
      } else { alert(data.error) }
    } catch(e) {} finally { setSaving(false) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Hapus produk ini?')) return
    const token = localStorage.getItem('token')
    await fetch(`/api/products/${id}`, { method:'DELETE', headers:{'Authorization':`Bearer ${token}`} })
    setProducts(products.filter(p => p.id !== id))
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}><div style={{width:'36px',height:'36px',border:'3px solid rgba(167,139,250,0.2)',borderTop:'3px solid #a78bfa',borderRadius:'50%'}}/></div>

  const inputS = {width:'100%',padding:'11px 14px',borderRadius:'10px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:'14px',outline:'none',boxSizing:'border-box',marginBottom:'12px'}
  const labelS = {display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'6px'}

  return (
    <div style={{padding:'20px 16px',paddingBottom:'90px'}}>
      {/* Store Header */}
      <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(91,33,182,0.15))',borderRadius:'20px',padding:'20px',border:'1px solid rgba(124,58,237,0.2)',marginBottom:'20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
          <div style={{width:'44px',height:'44px',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <div>
            <h1 style={{fontSize:'18px',fontWeight:'800',color:'white',margin:'0 0 2px'}}>{store?.storeName}</h1>
            <span style={{fontSize:'11px',color:'#4ade80',fontWeight:'600'}}>Aktif</span>
          </div>
        </div>
        <div style={{display:'flex',gap:'20px'}}>
          {[{label:'Produk',val:products.length},{label:'Pesanan',val:0},{label:'Pendapatan',val:'Rp0'}].map(s => (
            <div key={s.label}>
              <p style={{fontSize:'18px',fontWeight:'900',color:'white',margin:'0 0 2px'}}>{s.val}</p>
              <p style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0,textTransform:'uppercase',letterSpacing:'0.5px'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
        {[{id:'products',label:'Produk'},{id:'orders',label:'Pesanan'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{padding:'8px 20px',borderRadius:'99px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'700',background:tab===t.id?'#7c3aed':'rgba(255,255,255,0.06)',color:tab===t.id?'white':'rgba(255,255,255,0.5)'}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <button onClick={() => setShowAdd(!showAdd)} style={{width:'100%',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'white',padding:'13px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'700',marginBottom:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Produk
          </button>

          {showAdd && (
            <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'16px',padding:'20px',border:'1px solid rgba(255,255,255,0.09)',marginBottom:'16px'}}>
              <h3 style={{fontSize:'15px',fontWeight:'700',color:'white',marginBottom:'16px'}}>Produk Baru</h3>
              <form onSubmit={addProduct}>
                <label style={labelS}>Nama Produk *</label>
                <input style={inputS} placeholder="Nama produk" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
                
                <label style={labelS}>Deskripsi</label>
                <textarea style={{...inputS,resize:'none'}} rows="3" placeholder="Deskripsi produk" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  <div>
                    <label style={labelS}>Harga (Rp) *</label>
                    <input style={inputS} type="number" placeholder="50000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
                  </div>
                  <div>
                    <label style={labelS}>Stok</label>
                    <input style={inputS} type="number" placeholder="999" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
                  </div>
                </div>

                <label style={labelS}>Tipe Produk</label>
                <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
                  {['digital','physical'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({...form,productType:t,fileUrl:'',fileName:''})} style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'700',background:form.productType===t?'#7c3aed':'rgba(255,255,255,0.06)',color:form.productType===t?'white':'rgba(255,255,255,0.5)'}}>
                      {t === 'digital' ? 'Digital' : 'Fisik'}
                    </button>
                  ))}
                </div>

                {/* Upload produk digital */}
                {form.productType === 'digital' && (
                  <div style={{marginBottom:'12px'}}>
                    <label style={labelS}>File Produk *</label>
                    <p style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginBottom:'8px'}}>Format: PDF, TXT, PNG, JPG, XLSX, PY (maks 10MB)</p>
                    <input ref={fileRef} type="file" accept=".pdf,.txt,.png,.jpg,.jpeg,.xlsx,.py,.zip" style={{display:'none'}} onChange={e => handleFileUpload(e, 'product')} />
                    <button type="button" onClick={() => fileRef.current.click()} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'2px dashed rgba(124,58,237,0.4)',background:'rgba(124,58,237,0.08)',color:form.fileUrl?'#4ade80':'#a78bfa',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>
                      {uploading ? 'Mengupload...' : form.fileUrl ? `Terupload: ${form.fileName}` : 'Klik untuk upload file produk'}
                    </button>
                  </div>
                )}

                {/* Upload foto produk */}
                <div style={{marginBottom:'16px'}}>
                  <label style={labelS}>{form.productType === 'digital' ? 'Foto Cover (opsional)' : 'Foto Produk *'}</label>
                  <input ref={imageRef} type="file" accept=".png,.jpg,.jpeg,.webp" style={{display:'none'}} onChange={e => handleFileUpload(e, 'image')} />
                  {form.imageUrl ? (
                    <div style={{position:'relative'}}>
                      <img src={form.imageUrl} style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'10px',border:'1px solid rgba(124,58,237,0.3)'}} alt="preview"/>
                      <button type="button" onClick={() => setForm({...form,imageUrl:''})} style={{position:'absolute',top:'8px',right:'8px',background:'rgba(0,0,0,0.6)',border:'none',borderRadius:'50%',width:'28px',height:'28px',cursor:'pointer',color:'white',fontSize:'16px'}}>×</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => imageRef.current.click()} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'2px dashed rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.03)',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>
                      {uploading ? 'Mengupload...' : 'Klik untuk upload foto'}
                    </button>
                  )}
                </div>

                <div style={{display:'flex',gap:'10px'}}>
                  <button type="button" onClick={() => setShowAdd(false)} style={{flex:1,padding:'12px',borderRadius:'10px',background:'rgba(255,255,255,0.06)',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.6)',fontWeight:'700',fontSize:'14px'}}>Batal</button>
                  <button type="submit" disabled={saving||uploading} style={{flex:2,padding:'12px',borderRadius:'10px',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',border:'none',cursor:'pointer',color:'white',fontWeight:'700',fontSize:'14px',opacity:saving||uploading?0.7:1}}>
                    {saving ? 'Menyimpan...' : 'Simpan Produk'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.3)'}}>
              <svg style={{margin:'0 auto 12px',display:'block'}} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
              <p style={{fontSize:'14px'}}>Belum ada produk. Tambah sekarang!</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {products.map(p => (
                <div key={p.id} style={{background:'rgba(255,255,255,0.05)',borderRadius:'14px',padding:'14px',border:'1px solid rgba(255,255,255,0.08)',display:'flex',gap:'12px',alignItems:'center'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'10px',overflow:'hidden',flexShrink:0,background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(91,33,182,0.2))',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {p.imageUrl ? <img src={p.imageUrl} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/> : <svg width="22" height="22" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:'14px',fontWeight:'700',color:'white',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                    <p style={{fontSize:'13px',color:'#a78bfa',fontWeight:'700',margin:'0 0 4px'}}>Rp{p.price.toLocaleString('id-ID')}</p>
                    <div style={{display:'flex',gap:'6px'}}>
                      <span style={{fontSize:'10px',background:'rgba(124,58,237,0.2)',color:'#a78bfa',padding:'2px 8px',borderRadius:'99px',fontWeight:'600'}}>{p.productType === 'digital' ? 'Digital' : 'Fisik'}</span>
                      {p.fileUrl && <span style={{fontSize:'10px',background:'rgba(52,211,153,0.15)',color:'#4ade80',padding:'2px 8px',borderRadius:'99px',fontWeight:'600'}}>File OK</span>}
                      <span style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>Stok: {p.stock}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'8px',cursor:'pointer',color:'#f87171',display:'flex',alignItems:'center'}}>
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
          <svg style={{margin:'0 auto 12px',display:'block'}} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
          <p style={{fontSize:'14px'}}>Belum ada pesanan masuk</p>
        </div>
      )}
    </div>
  )
}
