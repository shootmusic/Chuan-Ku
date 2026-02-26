echo "🔍 VERIFIKASI FILE DAN FOLDER CHUÀNG KÙ"
echo "========================================"
echo ""

# Hitung total
total=0
ada=0
missing=0

# Fungsi cek
cek() {
  total=$((total+1))
  if [ -e "$1" ]; then
    echo "✅ $1"
    ada=$((ada+1))
  else
    echo "❌ $1"
    missing=$((missing+1))
  fi
}

echo "📁 ROOT FOLDER:"
cek "package.json"
cek ".gitignore"
cek "next.config.js"
cek "tailwind.config.js"
cek ".env"
cek "prisma"

echo ""
echo "📁 PRISMA:"
cek "prisma/schema.prisma"
cek "prisma/seed.js"

echo ""
echo "📁 LIB:"
cek "lib/prisma.js"
cek "lib/auth.js"
cek "lib/telegram.js"
cek "lib/gemini.js"

echo ""
echo "📁 COMPONENTS:"
cek "components/BottomNav.js"
cek "components/ProductCard.js"
cek "components/PaymentModal.js"
cek "components/TelegramBot/bot.js"
cek "components/TelegramBot/handlers.js"

echo ""
echo "📁 APP ROOT:"
cek "app/layout.js"
cek "app/page.js"
cek "app/globals.css"

echo ""
echo "📁 APP/AUTH:"
cek "app/(auth)/layout.js"
cek "app/(auth)/login/page.js"
cek "app/(auth)/register/page.js"

echo ""
echo "📁 APP/DASHBOARD:"
cek "app/dashboard/layout.js"
cek "app/dashboard/dashboard/page.js"
cek "app/dashboard/profile/page.js"
cek "app/dashboard/cart/page.js"
cek "app/dashboard/checkout/page.js"
cek "app/dashboard/open-store/page.js"

echo ""
echo "📁 APP/API:"
cek "app/api/auth/login/route.js"
cek "app/api/auth/register/route.js"
cek "app/api/auth/me/route.js"
cek "app/api/cart/route.js"
cek "app/api/cart/count/route.js"
cek "app/api/products/route.js"
cek "app/api/checkout/route.js"
cek "app/api/store/route.js"
cek "app/api/telegram/webhook/route.js"
cek "app/api/payment/saweria-webhook/route.js"

echo ""
echo "========================================"
echo "📊 HASIL VERIFIKASI:"
echo "Total file dicek: $total"
echo "✅ ADA: $ada"
echo "❌ MISSING: $missing"
echo "========================================"

if [ $missing -eq 0 ]; then
  echo "🎉 SEMUA FILE LENGKAP! SIAP JALAN!"
else
  echo "⚠️  MASIH ADA $missing FILE KURANG!"
  echo "   Jalanin script lanjutan buat generate yang kurang."
fi

