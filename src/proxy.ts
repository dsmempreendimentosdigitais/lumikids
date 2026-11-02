import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que exigem login. A leitura de histórias (/app/historias/[id]) fica aberta
// para permitir o teste gratuito sem cadastro — o paywall é controlado no cliente.
const protectedRoutes = ['/app/criar', '/app/progresso', '/app/configuracoes', '/app/admin'];
const authRoutes = ['/login', '/cadastro'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookie espelhado do token Firebase (renovado automaticamente no AuthContext)
  const session = request.cookies.get('session')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route);

  if (isProtectedRoute && !session) {
    // Página de login real do app é /login (antes apontava para /auth/login, que não existe
    // e causava o loop "Voltando à Trilha de Histórias")
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/cadastro'],
};
