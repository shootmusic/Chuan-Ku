import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 24px', background:'rgba(0,0,0,0.2)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <h1 style={{fontSize:'22px', fontWeight:'800', color:'white', margin:0}}>Chuàng Kù 创库</h1>
        <div style={{display:'flex', gap:'12px'}}>
          <Link href="/login"><button className="btn-outline" style={{padding:'8px 20px', fontSize:'14px'}}>Login</button></Link>
          <Link href="/register"><button className="btn-primary" style={{padding:'8px 20px', fontSize:'14px'}}>Daftar</button></Link>
        </div>
      </nav>

      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'60px 24px'}}>
        <span style={{background:'rgba(255,220,0,0.15)', border:'1px solid rgba(255,220,0,0.4)', color:'#ffd700', fontSize:'13px', padding:'6px 16px', borderRadius:'99px', marginBottom:'24px', display:'inline-block'}}>
          Auto Payment via Telegram Bot
        </span>
        <h2 style={{fontSize:'48px', fontWeight:'900', color:'white', lineHeight:'1.1', marginBottom:'20px', maxWidth:'600px'}}>
          Marketplace Digital<br/>
          <span style={{color:'#ffd700'}}>Auto Payment</span>
        </h2>
        <p style={{fontSize:'17px', color:'rgba(255,255,255,0.65)', marginBottom:'36px', maxWidth:'480px', lineHeight:'1.6'}}>
          Jual apapun, dapatkan pembayaran otomatis via Telegram. Digital atau fisik, semua bisa!
        </p>
        <div style={{display:'flex', gap:'16px', flexWrap:'wrap', justifyContent:'center'}}>
          <Link href="/register"><button className="btn-primary" style={{padding:'14px 32px', fontSize:'16px'}}>Mulai Jualan</button></Link>
          <Link href="/dashboard/dashboard"><button className="btn-outline" style={{padding:'14px 32px', fontSize:'16px'}}>Lihat Demo</button></Link>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'20px', padding:'0 24px 60px', maxWidth:'900px', margin:'0 auto', width:'100%'}}>
        {[
          {icon:'⚡', title:'Auto Payment', desc:'QRIS, Gopay, VA, Saweria auto integrate dengan notifikasi Telegram'},
          {icon:'🤖', title:'Telegram Notif', desc:'Notifikasi realtime + konfirmasi via bot, ga perlu ngecek dashboard'},
          {icon:'🏪', title:'Multi Store', desc:'Buka toko sendiri dengan payment method masing-masing'},
        ].map((f) => (
          <div key={f.title} className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:'36px', marginBottom:'12px'}}>{f.icon}</div>
            <h3 style={{fontSize:'18px', fontWeight:'700', marginBottom:'8px'}}>{f.title}</h3>
            <p style={{fontSize:'14px', color:'rgba(255,255,255,0.6)', lineHeight:'1.5'}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
