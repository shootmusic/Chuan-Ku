import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (!decoded || decoded.type !== 'reset') {
      return NextResponse.json({ error: 'Token tidak valid atau sudah expired' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: 'Password berhasil diubah' })
  } catch (error) {
    return NextResponse.json({ error: 'Token tidak valid atau sudah expired' }, { status: 400 })
  }
}
