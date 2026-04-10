import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/app', '/app/historias', '/app/criar', '/app/progresso', '/app/configuracoes'];
const authRoutes = ['/auth/login', '/auth/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exemplo simplificado de verificação de sessão
  // No mundo real, usaríamos o Firebase Admin ou um cookie seguro com o token
  const session = request.cookies.get('session')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    // Se tentar acessar rota protegida sem sessão, manda pro login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    // Se já estiver logado e tentar acessar login/cadastro, manda pro app
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/auth/:path*'],
};
