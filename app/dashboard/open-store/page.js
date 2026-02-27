'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OpenStorePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    storeName: '', storeDescription: '',
    paymentMethods: ['qris','saweria','gopay','bank','va'],
    paymentDetails: { qris:'', saweria:'', gopay:'', bank:'', va:'' },
    telegramChatId: '', email: ''
  })

  const set = (k, v) => setForm({...form, [k]: v})
  const setPD = (k, v) => setForm({...form, paymentDetails: {...form.paymentDetails, [k]: v}})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/store', {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) { setStep(2) }
      else { alert('Gagal: ' + data.error) }
    } catch { alert('Terjadi kesalahan') }
    finally { setLoading(false) }
  }

  const label = (text, required) => (
    <label style={{display:'block', fontSize:'12px', fontWeight:'600', marginBottom:'6px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.5px'}}>
      {text}{required && <span style={{color:'#f87171', marginLeft:'3px'}}>*</span>}
    </label>
  )

  const input = (props) => (
    <input {...props} style={{width:'100%', padding:'11px 14px', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box', marginBottom:'16px'}} />
  )

  if (step === 2) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{textAlign:'center', maxWidth:'400px'}}>
        <div style={{width:'64px', height:'64px', background:'rgba(124,58,237,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
          <svg width="28" height="28" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h2 style={{fontSize:'22px', fontWeight:'800', color:'white', marginBottom:'10px'}}>Cek Email Kamu!</h2>
        <p style={{fontSize:'14px', color:'rgba(255,255,255,0.5)', lineHeight:'1.6', marginBottom:'24px'}}>
          Link verifikasi sudah dikirim ke <strong style={{color:'white'}}>{form.email}</strong>
        </p>
        <button onClick={() => router.push('/dashboard/dashboard')} style={{background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'white', padding:'12px 28px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'700', fontSize:'14px'}}>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div style={{padding:'24px 16px', paddingBottom:'40px', maxWidth:'500px', margin:'0 auto'}}>
      <h1 style={{fontSize:'20px', fontWeight:'800', color:'white', marginBottom:'24px'}}>Buka Toko</h1>

      <form onSubmit={handleSubmit}>
        <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px', border:'1px solid rgba(255,255,255,0.08)', marginBottom:'16px'}}>
          <h2 style={{fontSize:'14px', fontWeight:'700', color:'#a78bfa', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.5px'}}>Informasi Toko</h2>
          {label('Nama Toko', true)}
          {input({type:'text', placeholder:'Nama toko kamu', value:form.storeName, onChange:(e)=>set('storeName',e.target.value), required:true})}
          {label('Deskripsi')}
          <textarea value={form.storeDescription} onChange={(e)=>set('storeDescription',e.target.value)} placeholder="Deskripsi singkat toko kamu" rows="3" style={{width:'100%', padding:'11px 14px', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box', resize:'none', marginBottom:'16px'}}/>
        </div>

        <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px', border:'1px solid rgba(255,255,255,0.08)', marginBottom:'16px'}}>
          <h2 style={{fontSize:'14px', fontWeight:'700', color:'#a78bfa', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.5px'}}>Detail Payment</h2>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'16px'}}>Isi sesuai metode yang kamu punya</p>
          {label('QRIS (ID/URL)')}
          {input({type:'text', placeholder:'https://... atau ID QRIS', value:form.paymentDetails.qris, onChange:(e)=>setPD('qris',e.target.value)})}
          {label('Saweria (Stream Key)')}
          {input({type:'text', placeholder:'Stream key Saweria kamu', value:form.paymentDetails.saweria, onChange:(e)=>setPD('saweria',e.target.value)})}
          {label('GoPay (Nomor)')}
          {input({type:'text', placeholder:'08xxxxxxxxxx', value:form.paymentDetails.gopay, onChange:(e)=>setPD('gopay',e.target.value)})}
          {label('Transfer Bank (No Rekening)')}
          {input({type:'text', placeholder:'BCA 1234567890 a.n Nama', value:form.paymentDetails.bank, onChange:(e)=>setPD('bank',e.target.value)})}
          {label('Virtual Account (Kode VA)')}
          {input({type:'text', placeholder:'Kode VA kamu', value:form.paymentDetails.va, onChange:(e)=>setPD('va',e.target.value)})}
        </div>

        <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px', border:'1px solid rgba(255,255,255,0.08)', marginBottom:'24px'}}>
          <h2 style={{fontSize:'14px', fontWeight:'700', color:'#a78bfa', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.5px'}}>Integrasi Telegram</h2>
          {label('Telegram Chat ID', true)}
          {input({type:'text', placeholder:'Contoh: 7710155531', value:form.telegramChatId, onChange:(e)=>set('telegramChatId',e.target.value), required:true})}
          <p style={{fontSize:'11px', color:'rgba(255,255,255,0.3)', marginTop:'-12px', marginBottom:'16px'}}>Chat @userinfobot di Telegram untuk dapat ID kamu</p>
          {label('Email Verifikasi', true)}
          {input({type:'email', placeholder:'email@kamu.com', value:form.email, onChange:(e)=>set('email',e.target.value), required:true})}
        </div>

        <button type="submit" disabled={loading} style={{width:'100%', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'white', padding:'14px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'15px', fontWeight:'700', opacity: loading ? 0.7 : 1}}>
          {loading ? 'Memproses...' : 'Buat Toko Sekarang'}
        </button>
      </form>
    </div>
  )
}
