import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Protect Admin Panel
  if (pathname.startsWith('/admin')) {
    const adminAuth = request.cookies.get('admin_auth')?.value
    const accessKey = process.env.ADMIN_ACCESS_KEY || '1234'

    if (adminAuth !== accessKey) {
      // Redirect to home if not authorized, but allow the main admin page to show its own login if needed
      // Actually, it's better to intercept here.
      // If they are on /admin and not verified, we can let them see the login UI, 
      // but we must protect all sub-pages and API calls.
      
      // For simplicity, if they aren't verified, we'll let them stay on /admin (which has the login form)
      // but sub-pages like /admin/gallery should be blocked.
      if (pathname !== '/admin' && pathname !== '/admin/login') {
         return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  // 2. Protect API Data Mutation Methods
  if (pathname.startsWith('/api/')) {
    const method = request.method
    const isMutation = ['POST', 'PUT', 'DELETE'].includes(method)
    
    // Whitelist public/read-only or specific safe APIs if any
    const isPublicApi = pathname.includes('/api/contact-info') && method === 'GET' ||
                        pathname.includes('/api/menu-items') && method === 'GET' ||
                        pathname.includes('/api/categories') && method === 'GET' ||
                        pathname.includes('/api/gallery') && method === 'GET' ||
                        pathname.includes('/api/testimonials') && method === 'GET'

    if (isMutation && !isPublicApi) {
      const adminAuth = request.cookies.get('admin_auth')?.value
      const authHeader = request.headers.get('x-admin-key')
      const accessKey = process.env.ADMIN_ACCESS_KEY || '1234'

      if (adminAuth !== accessKey && authHeader !== accessKey) {
        return NextResponse.json(
          { error: 'Unauthorized access', code: 'UNAUTHORIZED' },
          { status: 401 }
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}
