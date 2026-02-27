export default function AuthLayout({ children }) {
  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{width:'100%', maxWidth:'400px'}}>
        <div style={{textAlign:'center', marginBottom:'28px'}}>
          <div style={{marginBottom:'6px'}}>
            <span style={{fontSize:'26px', fontWeight:'900', color:'white', letterSpacing:'-0.5px'}}>Chuàng Kù</span>
            <span style={{fontSize:'26px', fontWeight:'900', color:'#a78bfa', marginLeft:'6px'}}>创库</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
