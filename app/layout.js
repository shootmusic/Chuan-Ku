import './globals.css'

export const metadata = {
  title: 'Chuàng Kù 创库',
  description: 'Marketplace digital auto payment via Telegram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
