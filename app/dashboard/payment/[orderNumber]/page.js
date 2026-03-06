'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.orderNumber
  const [copied, setCopied] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('lastPaymentMethod') || 'qris'
    setPaymentMethod(saved)
    const lastOrder = localStorage.getItem('lastOrder')
    if (lastOrder) setOrder(JSON.parse(lastOrder))
  }, [])

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const S = {
    page: {background:'#0f0520',minHeight:'100vh',padding:'20px',display:'flex',alignItems:'flex-start',justifyContent:'center'},
    card: {width:'100%',maxWidth:'420px',background:'rgba(255,255,255,0.05)',borderRadius:'20px',padding:'24px',border:'1px solid rgba(255,255,255,0.1)'},
    title: {fontSize:'22px',fontWeight:'900',color:'white',marginBottom:'20px'},
    orderBox: {background:'rgba(0,0,0,0.3)',borderRadius:'14px',padding:'16px',marginBottom:'20px',textAlign:'center'},
    label: {fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px'},
    orderNum: {fontFamily:'monospace',fontWeight:'700',color:'#fbbf24',fontSize:'16px'},
    total: {fontSize:'28px',fontWeight:'900',color:'white',marginTop:'8px'},
    section: {marginBottom:'20px'},
    qrBox: {background:'white',padding:'12px',borderRadius:'16px',display:'inline-block'},
    infoBox: {background:'rgba(0,0,0,0.3)',borderRadius:'14px',padding:'16px',display:'flex',alignItems:'center',justifyContent:'space-between'},
    copyBtn: {background:'#7c3aed',border:'none',borderRadius:'8px',padding:'8px 14px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer'},
    noteBox: {background:'rgba(234,179,8,0.15)',border:'1px solid rgba(234,179,8,0.3)',borderRadius:'14px',padding:'16px',marginBottom:'20px'},
    noteText: {fontSize:'13px',color:'#fcd34d',lineHeight:'1.6',margin:0},
    backBtn: {width:'100%',padding:'14px',borderRadius:'12px',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',border:'none',cursor:'pointer',color:'white',fontSize:'15px',fontWeight:'700'},
  }

  const renderPayment = () => {
    if (paymentMethod === 'qris') return (
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginBottom:'16px'}}>Scan QR Code pakai e-wallet atau mobile banking</p>
        <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
          <div style={S.qrBox}>
            <img src={process.env.NEXT_PUBLIC_SAWERIA_QR_URL || "https://saweria.co/widgets/qr?streamKey=83100dfb5ad6f643d7a0776000a0eac6"} alt="QRIS" style={{width:'200px',height:'200px',display:'block'}} onError={e=>e.target.style.display='none'}/>
          </div>
        </div>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>Total: <b style={{color:'white'}}>Rp{order?.total?.toLocaleString('id-ID') || '-'}</b></p>
      </div>
    )

    if (paymentMethod === 'saweria') return (
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginBottom:'16px'}}>Klik tombol untuk bayar via Saweria</p>
        <a href={process.env.NEXT_PUBLIC_SAWERIA_PAGE_URL || "https://saweria.co"} target="_blank" rel="noopener noreferrer"
          style={{display:'inline-block',padding:'12px 32px',background:'linear-gradient(135deg,#7c3aed,#5b21b6)',borderRadius:'12px',color:'white',fontWeight:'700',fontSize:'15px',textDecoration:'none'}}>
          Buka Saweria 💸
        </a>
      </div>
    )

    if (paymentMethod === 'gopay') return (
      <div>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginBottom:'12px'}}>Transfer ke nomor GoPay:</p>
        <div style={S.infoBox}>
          <div>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:'0 0 2px'}}>GoPay</p>
            <p style={{fontFamily:'monospace',fontWeight:'700',fontSize:'18px',color:'white',margin:'0 0 2px'}}>081234567890</p>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0}}>a.n Chuanku</p>
          </div>
          <button onClick={() => copy('081234567890','gopay')} style={S.copyBtn}>{copied==='gopay'?'✓ Copied!':'Copy'}</button>
        </div>
      </div>
    )

    if (paymentMethod === 'transfer') return (
      <div>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginBottom:'12px'}}>Transfer ke rekening:</p>
        <div style={S.infoBox}>
          <div>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:'0 0 2px'}}>BCA</p>
            <p style={{fontFamily:'monospace',fontWeight:'700',fontSize:'18px',color:'white',margin:'0 0 2px'}}>1234567890</p>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0}}>a.n Chuanku</p>
          </div>
          <button onClick={() => copy('1234567890','bank')} style={S.copyBtn}>{copied==='bank'?'✓ Copied!':'Copy'}</button>
        </div>
      </div>
    )
    return null
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.title}>💳 Pembayaran</h1>

        <div style={S.orderBox}>
          <p style={S.label}>Order Number</p>
          <p style={S.orderNum}>{orderNumber}</p>
          {order && <p style={S.total}>Rp{order.total?.toLocaleString('id-ID')}</p>}
        </div>

        <div style={S.section}>
          {renderPayment()}
        </div>

        <div style={S.noteBox}>
          <p style={S.noteText}>
            📸 Setelah bayar, screenshot bukti pembayaran dan kirim ke bot Telegram:<br/>
            <b>@Chuangkubot</b><br/><br/>
            Bot akan otomatis memproses pesananmu!
          </p>
        </div>

        <button onClick={() => router.push('/dashboard/dashboard')} style={S.backBtn}>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}
