import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <nav style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'18px 32px',
        background:'rgba(0,0,0,0.25)',
        backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        position:'sticky', top:0, zIndex:100
      }}>
        <div>
          <span style={{fontSize:'20px', fontWeight:'800', color:'white', letterSpacing:'-0.5px'}}>Chuàng Kù</span>
          <span style={{fontSize:'20px', fontWeight:'800', color:'#a78bfa', marginLeft:'6px'}}>创库</span>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <Link href="/login"><button className="btn-outline" style={{padding:'8px 20px', fontSize:'13px'}}>Login</button></Link>
          <Link href="/register"><button className="btn-primary" style={{padding:'8px 20px', fontSize:'13px'}}>Daftar</button></Link>
        </div>
      </nav>

      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 24px 60px'}}>
        <span className="badge" style={{marginBottom:'28px'}}>Auto Payment via Telegram</span>
        
        <h1 style={{fontSize:'clamp(40px, 6vw, 72px)', fontWeight:'900', lineHeight:'1.05', marginBottom:'10px', letterSpacing:'-2px'}}>
          Chuàng Kù
        </h1>
        <h1 style={{fontSize:'clamp(40px, 6vw, 72px)', fontWeight:'900', lineHeight:'1.05', marginBottom:'24px', letterSpacing:'-2px', color:'#a78bfa'}}>
          创库
        </h1>

        <p style={{fontSize:'clamp(15px, 2vw, 18px)', color:'rgba(255,255,255,0.55)', marginBottom:'40px', maxWidth:'460px', lineHeight:'1.7'}}>
          Jual apapun, dapatkan pembayaran otomatis via Telegram.<br/>Digital atau fisik, semua bisa.
        </p>

        <div style={{display:'flex', gap:'14px', flexWrap:'wrap', justifyContent:'center', marginBottom:'80px'}}>
          <Link href="/register"><button className="btn-primary" style={{padding:'14px 34px', fontSize:'15px'}}>Mulai Jualan</button></Link>
          <Link href="/dashboard/dashboard"><button className="btn-outline" style={{padding:'14px 34px', fontSize:'15px'}}>Lihat Demo</button></Link>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'16px', maxWidth:'800px', width:'100%'}}>
          {[
            {title:'Auto Payment', desc:'QRIS, GoPay, VA, Saweria terintegrasi langsung dengan notifikasi Telegram real-time.'},
            {title:'Notif Telegram', desc:'Konfirmasi pembayaran langsung via bot. Tidak perlu cek dashboard terus.'},
            {title:'Multi Toko', desc:'Buka toko sendiri dengan payment method dan Telegram ID masing-masing.'},
          ].map((f) => (
            <div key={f.title} className="card" style={{textAlign:'left'}}>
              <div style={{width:'32px', height:'3px', background:'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius:'2px', marginBottom:'14px'}}></div>
              <h3 style={{fontSize:'15px', fontWeight:'700', marginBottom:'8px', color:'white'}}>{f.title}</h3>
              <p style={{fontSize:'13px', color:'rgba(255,255,255,0.5)', lineHeight:'1.6'}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer style={{textAlign:'center', padding:'20px', borderTop:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.25)', fontSize:'12px'}}>
        2024 Chuàng Kù 创库. All rights reserved.
      </footer>
    </div>
  )
}
