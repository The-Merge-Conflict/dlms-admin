// src/middleware.ts
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 🚧 TEMPORARY BYPASS FOR UI TESTING 🚧
  // This tells Next.js to let everyone through without checking tokens.
  return NextResponse.next(); 

  /* --- REAL SECURITY LOGIC (Commented out for now) ---
  const token = request.cookies.get('dlms_token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  --------------------------------------------------- */
}

export const config = { matcher: ['/dashboard/:path*'] };