import { FIREBASE_SESSION_NAME } from '@/app/admin/_consts/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const options = {
    name: FIREBASE_SESSION_NAME,
    value: '',
    maxAge: -1,
  };

  cookies().set(options);
  return NextResponse.json({}, { status: 200 });
}
