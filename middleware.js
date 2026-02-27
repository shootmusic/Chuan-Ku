import { NextResponse } from 'next/server'

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  const isApi = path.startsWith('/api')
  const isPublic = path === '/' || path === '/login' || path === '/register'
  const isDashboard = path.startsWith('/dashboard') || path.startsWith('/chat')

  if (isApi) return NextResponse.next()
  if (isPublic) return NextResponse.next()

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
