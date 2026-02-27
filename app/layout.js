import './globals.css'

export const metadata = {
  title: 'Chuàng Kù 创库 - Marketplace Digital',
  description: 'Jual beli produk digital dengan auto payment via Telegram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
