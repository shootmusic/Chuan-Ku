const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: { username:'demo', email:'demo@chuangku.com', password:hashedPassword }
  })

  const store = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      storeName: 'Chuàng Kù Official',
      storeDescription: 'Toko resmi Chuàng Kù',
      paymentMethods: JSON.stringify(['qris','saweria']),
      paymentDetails: JSON.stringify({ qris:'https://saweria.co/widgets/qr?streamKey=83100dfb5ad6f643d7a0776000a0eac6', saweria:'83100dfb5ad6f643d7a0776000a0eac6' }),
      telegramChatId: '7710155531',
      isVerified: true
    }
  })

  const products = [
    { name:'Ebook Digital Marketing 2024', description:'Panduan lengkap digital marketing dari nol sampai mahir. 200+ halaman.', price:75000, productType:'digital', stock:999 },
    { name:'Source Code Bot Telegram', description:'Source code bot Telegram dengan fitur payment otomatis. Langsung deploy.', price:150000, productType:'digital', stock:999 },
    { name:'Template Next.js Marketplace', description:'Template marketplace lengkap dengan Next.js, Tailwind, Prisma. Siap pakai.', price:200000, productType:'digital', stock:999 },
    { name:'Video Course Fullstack Web Dev', description:'Belajar fullstack web development dari 0. React, Node.js, PostgreSQL.', price:350000, productType:'digital', stock:999 },
    { name:'Preset Lightroom Premium Pack', description:'50 preset Lightroom profesional untuk foto portrait dan landscape.', price:45000, productType:'digital', stock:999 },
    { name:'UI Kit Figma Dashboard', description:'UI Kit dashboard lengkap dengan 200+ komponen siap pakai di Figma.', price:120000, productType:'digital', stock:999 },
  ]

  for (const p of products) {
    await prisma.product.create({ data: { ...p, storeId: store.id } })
  }

  console.log('Done! 6 produk dibuat.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
