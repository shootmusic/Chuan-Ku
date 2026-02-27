import BottomNav from '@/components/BottomNav'

export default function DashboardLayout({ children }) {
  return (
    <div style={{minHeight:'100vh', paddingBottom:'72px'}}>
      {children}
      <BottomNav />
    </div>
  )
}
