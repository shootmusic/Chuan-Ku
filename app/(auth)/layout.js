export default function AuthLayout({ children }) {
  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{width:'100%', maxWidth:'420px'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <h1 style={{fontSize:'28px', fontWeight:'900', color:'white', margin:'0 0 8px'}}>Chuàng Kù 创库</h1>
          <p style={{color:'rgba(255,255,255,0.5)', fontSize:'14px', margin:0}}>Marketplace Digital Auto Payment</p>
        </div>
        {children}
      </div>
    </div>
  )
}
