import { SignJWT, jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-ganti-di-production');

export async function signToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('8h').sign(secret());
}

export async function verifyToken(token) {
  try {
    return (await jwtVerify(token, secret())).payload;
  } catch {
    return null;
  }
}
