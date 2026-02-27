import { NextResponse } from 'next/server'
import { chatWithGemini } from '@/lib/gemini'

export async function POST(request) {
  try {
    const { message, history } = await request.json()
    const result = await chatWithGemini(message, history)

    if (result.success) {
      return NextResponse.json({ text: result.text })
    } else {
      return NextResponse.json({ text: 'Maaf, lagi error nih. Coba lagi ya!' })
    }
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ text: 'Server error, coba lagi!' })
  }
}
