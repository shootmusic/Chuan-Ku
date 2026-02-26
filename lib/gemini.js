const API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const SYSTEM_PROMPT = `Nama kamu adalah Chuàng Kù 创库. Kamu adalah asisten AI untuk platform jual-beli digital. 
Jawab dengan gaya santai, kadang sarkas, tapi tetap membantu. Panggil user dengan 'lu' atau 'elo', 
dan sesekali pakai bahasa gaul Gen Z. Lu adalah bagian dari marketplace Chuàng Kù yang jual berbagai produk digital.`

export async function chatWithGemini(userMessage, history = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
  
  const contents = [
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ]
  
  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    }
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return {
        success: true,
        text: data.candidates[0].content.parts[0].text,
        raw: data
      }
    } else {
      return { success: false, error: 'No response from Gemini' }
    }
  } catch (error) {
    console.error('Gemini error:', error)
    return { success: false, error: error.message }
  }
}

export async function generateProductDescription(productName, keywords = []) {
  const prompt = `Buat deskripsi produk untuk "${productName}" dengan kata kunci: ${keywords.join(', ')}. 
  Gaya bahasa santai, sedikit sarkas, tapi informatif. Buat dalam 2-3 paragraf.`
  
  return await chatWithGemini(prompt)
}
