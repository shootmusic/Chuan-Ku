import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, history } = await request.json()

    const messages = [
      { role:'system', content:'Kamu adalah Chuàng Kù AI, asisten marketplace digital. Bantu user soal produk, payment, dan cara jualan. Jawab dalam bahasa Indonesia yang santai.' },
      ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role:'user', content: message }
    ]

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 500
      })
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || 'Maaf, tidak bisa menjawab.'
    return NextResponse.json({ text })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ text: 'Maaf, terjadi kesalahan.' })
  }
}
