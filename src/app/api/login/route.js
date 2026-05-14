import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();    
    const goResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await goResponse.json();

    if (!goResponse.ok) {
      return NextResponse.json({ error: data.error || 'login gagal bor/sis' }, { status: goResponse.status });
    }

    // save token ke cookies, samain 4 jem exp nya
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set({
      name: 'auth_token',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 4 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}