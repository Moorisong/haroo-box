import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-zA-Z0-9-]+\.)*harooo\.co\.kr$/,
  /^https:\/\/([a-zA-Z0-9-]+\.)*haroo\.site$/,
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

export function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get('origin');
  if (origin && isAllowedOrigin(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Vary', 'Origin');
  }
  return res;
}
