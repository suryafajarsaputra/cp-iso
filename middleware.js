import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/adsmins/login' || pathname === '/api/admin/login') return NextResponse.next();

  const token = req.cookies.get('admin_token')?.value;
  if (token && (await verifyToken(token))) return NextResponse.next();

  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = req.nextUrl.clone();
  url.pathname = '/adsmins/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/adsmins/:path*', '/api/admin/:path*'] };
