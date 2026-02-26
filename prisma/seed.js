import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Buat user dummy
  const hashedPassword = await hashPassword('password123')
  
  const user = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@chuanku.com',
      password: hashedPassword,
      telegramUsername: '7710155531'
    }
  })
  
  console.log('✅ User demo created')
  
  // Buat store dummy
  const store = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      storeName: 'Chuàng Kù Official',
      storeDescription: 'Toko resmi Chuàng Kù, jual berbagai produk digital keren.',
      paymentMethods: JSON.stringify(['qris', 'saweria', 'gopay', 'bank', 'va']),
      paymentDetails: JSON.stringify({
        qris: 'https://saweria.co/widgets/qr?streamKey=83100dfb5ad6f643d7a0776000a0eac6',
        saweria: '83100dfb5ad6f643d7a0776000a0eac6',
        gopay: '081234567890',
        bank: 'BCA 1234567890 a.n Chuàng Kù',
        va: '9881234567890'
      }),
      telegramChatId: '7710155531',
      isVerified: true
    }
  })
  
  console.log('✅ Store dummy created')
  
  // Buat produk dummy
  const products = [
    {
      name: 'Ebook Hacking untuk Pemula',
      description: 'Belajar hacking dari nol sampe jadi hacker. Cocok buat yang baru mulai.',
      price: 50000,
      productType: 'digital',
      filePath: 'https://drive.google.com/ebook-hacking.pdf',
      stock: 999
    },
    {
      name: 'Source Code Bot Telegram',
      description: 'Source code bot Telegram lengkap dengan fitur payment. Bisa langsung deploy.',
      price: 150000,
      productType: 'digital',
      filePath: 'https://github.com/chuanku/bot-telegram',
      stock: 999
    },
    {
      name: 'Template Next.js Marketplace',
      description: 'Template marketplace siap pakai pake Next.js, Tailwind, Prisma.',
      price: 200000,
      productType: 'digital',
      filePath: 'https://github.com/chuanku/template-marketplace',
      stock: 999
    },
    {
      name: 'Video Course Fullstack Web',
      description: 'Belajar fullstack web dari 0 sampe deploy. 50 jam video.',
      price: 300000,
      productType: 'digital',
      filePath: 'https://drive.google.com/course-fullstack',
      stock: 999
    }
  ]
  
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        storeId: store.id
      }
    })
  }
  
  console.log('✅ 4 produk dummy created')
  console.log('🌱 Seeding selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
