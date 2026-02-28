const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  let user = await prisma.user.findFirst({ where: { username: 'chuangku_official' } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'chuangku_official',
        email: 'official@chuangku.com',
        password: await bcrypt.hash('chuangku2024!', 10)
      }
    })
    console.log('User official dibuat')
  }

  let store = await prisma.store.findFirst({ where: { userId: user.id } })
  if (!store) {
    store = await prisma.store.create({
      data: {
        userId: user.id,
        storeName: 'Chuàng Kù Official',
        storeDescription: 'Toko resmi platform Chuàng Kù',
        telegramChatId: '7710155531',
        isVerified: true
      }
    })
    console.log('Toko official dibuat')
  }

  const exists = await prisma.product.findFirst({ where: { name: 'Chuàng Kù Test Product' } })
  if (exists) { console.log('Produk sudah ada!'); return }

  const product = await prisma.product.create({
    data: {
      storeId: store.id,
      name: 'Chuàng Kù Test Product',
      description: 'Produk placeholder resmi untuk testing sistem pembayaran dan pengiriman digital Chuàng Kù 创库.',
      price: 1000,
      stock: 9999,
      productType: 'digital',
      fileUrl: 'https://res.cloudinary.com/dar6x3prf/image/upload/v1772258071/chuangku/products/li2mwryohsbs8zd9doto.pdf',
      fileName: 'Chuàng Kù 创库.pdf'
    }
  })
  console.log('Produk placeholder berhasil! ID:', product.id)
}

main().catch(console.error).finally(() => prisma.$disconnect())
