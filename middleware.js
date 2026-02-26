import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  const publicPaths = ['/', '/login', '/register']
  const isPublic = publicPaths.some(p => path.startsWith(p))
  const isApi = path.startsWith('/api')

  if (isApi) {
    return NextResponse.next()
  }

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
