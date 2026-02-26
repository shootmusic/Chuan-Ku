'use client'

import BottomNav from '@/components/BottomNav'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  
  const hideNav = pathname === '/login' || pathname === '/register'
  
  return (
    <div className="min-h-screen pb-16">
      {children}
      {!hideNav && <BottomNav />}
    </div>
  )
}
