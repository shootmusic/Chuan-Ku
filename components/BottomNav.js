'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  const active = (p) => pathname === p

  const navStyle = (p) => ({
    display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
    color: active(p) ? '#a78bfa' : 'rgba(255,255,255,0.45)',
    textDecoration:'none', fontSize:'11px', fontWeight:'600',
    transition:'color 0.2s', letterSpacing:'0.3px'
  })

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, height:'64px',
      background:'rgba(15,5,35,0.95)', backdropFilter:'blur(20px)',
      borderTop:'1px solid rgba(255,255,255,0.08)',
      display:'flex', justifyContent:'space-around', alignItems:'center',
      padding:'0 8px', zIndex:100
    }}>
      <Link href="/dashboard/dashboard" style={navStyle('/dashboard/dashboard')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </Link>
      <Link href="/chat" style={navStyle('/chat')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        Chat AI
      </Link>
      <Link href="/dashboard/cart" style={navStyle('/dashboard/cart')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        Keranjang
      </Link>
      <Link href="/dashboard/profile" style={navStyle('/dashboard/profile')}>
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Profile
      </Link>
    </div>
  )
}
