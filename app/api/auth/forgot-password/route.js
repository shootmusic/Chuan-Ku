import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ message: 'Jika email terdaftar, link reset akan dikirim.' })
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: 'reset' },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '1h' }
    )

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://chuangku.up.railway.app'}/reset-password?token=${resetToken}`

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD
      }
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Password - Chuàng Kù 创库',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#1a0533;color:white;padding:32px;border-radius:16px;">
          <h2 style="color:#a78bfa;margin-bottom:8px;">Chuàng Kù 创库</h2>
          <h3 style="margin-bottom:16px;">Reset Password</h3>
          <p style="color:rgba(255,255,255,0.7);margin-bottom:24px;">Klik tombol di bawah untuk reset password kamu. Link berlaku 1 jam.</p>
          <a href="${resetUrl}" style="background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
            Reset Password
          </a>
          <p style="color:rgba(255,255,255,0.3);margin-top:24px;font-size:12px;">Jika kamu tidak meminta reset password, abaikan email ini.</p>
        </div>
      `
    })

    return NextResponse.json({ message: 'Email terkirim' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Gagal mengirim email' }, { status: 500 })
  }
}
