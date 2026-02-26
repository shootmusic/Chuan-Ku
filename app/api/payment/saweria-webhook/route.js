import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Verifikasi stream key
    if (body.streamKey !== process.env.SAWERIA_STREAM_KEY) {
      return NextResponse.json({ error: 'Invalid stream key' }, { status: 401 })
    }
    
    // Cari order berdasarkan amount dan waktu (simplifikasi)
    // Idealnya pake transaction_id dari Saweria
    const pendingOrder = await prisma.order.findFirst({
      where: {
        totalAmount: body.amount,
        paymentStatus: 'pending',
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // 30 menit terakhir
        }
      },
      include: {
        user: true,
        store: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    if (pendingOrder) {
      // Update status
      await prisma.order.update({
        where: { id: pendingOrder.id },
        data: { 
          paymentStatus: 'paid',
          paymentProof: JSON.stringify(body) // Simpan raw webhook
        }
      })
      
      // Kirim notifikasi ulang (status paid)
      await sendTelegramMessage(
        process.env.TELEGRAM_OWNER_CHAT_ID,
        `💰 Pembayaran via Saweria masuk untuk order ${pendingOrder.orderNumber}!\nCek dan konfirmasi.`
      )
    }
    
    return NextResponse.json({ ok: true })
    
  } catch (error) {
    console.error('Saweria webhook error:', error)
    return NextResponse.json({ ok: true }) // Tetap return 200 biar ga diresend
  }
}
