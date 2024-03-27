import { adminAuth } from '@/app/_shared/lib/firebase/server';
import { FIREBASE_SESSION_NAME } from '@/app/admin/_consts/session';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (decodedToken) {
      const expiresIn = 60 * 60 * 24 * 1 * 1000;
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: FIREBASE_SESSION_NAME,
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export async function GET() {
  const session = cookies().get(FIREBASE_SESSION_NAME)?.value || '';

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await adminAuth.verifySessionCookie(session, true);

  if (!decodedClaims) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
