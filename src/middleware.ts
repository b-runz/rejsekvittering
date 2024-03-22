import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
 
export function middleware(request: NextRequest) {
    const cookieStore = cookies()
    if(!cookieStore.has('rklogin')){
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
  matcher: '/trips',
}