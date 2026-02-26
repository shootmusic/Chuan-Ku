'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, User, MessageCircle } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  
  const isActive = (path) => pathname === path
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/20">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/dashboard/dashboard" className={`flex flex-col items-center ${isActive('/dashboard/dashboard') ? 'text-yellow-300' : 'text-white'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/chat" className={`flex flex-col items-center ${isActive('/chat') ? 'text-yellow-300' : 'text-white'}`}>
          <MessageCircle size={24} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link href="/dashboard/cart" className={`flex flex-col items-center ${isActive('/dashboard/cart') ? 'text-yellow-300' : 'text-white'}`}>
          <ShoppingCart size={24} />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        
        <Link href="/dashboard/profile" className={`flex flex-col items-center ${isActive('/dashboard/profile') ? 'text-yellow-300' : 'text-white'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )
}
