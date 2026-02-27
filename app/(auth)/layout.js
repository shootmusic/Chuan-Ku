export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Chuàng Kù 创库</h1>
          <p className="text-gray-300 mt-2">Marketplace Digital Auto Payment</p>
        </div>
        {children}
      </div>
    </div>
  )
}
