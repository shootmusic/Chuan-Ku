import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        store: {
          select: {
            storeName: true
          }
        }
      }
    })
    
    return NextResponse.json({ products })
    
  } catch (error) {
    console.error('Error fetch products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
