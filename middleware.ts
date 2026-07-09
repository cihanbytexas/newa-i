import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Aşağıdaki yollar hariç tüm isteklerde middleware çalışsın:
     * - _next/static (statik dosyalar)
     * - _next/image (imaj optimizasyon API'si)
     * - favicon.ico (tarayıcı ikonu)
     * - public klasöründeki her türlü imaj (örn. .svg, .png, .jpg vb.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
