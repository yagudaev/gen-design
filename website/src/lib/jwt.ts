// edge friendly jwt library and implementation see: https://github.com/vercel/next.js/issues/43115
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function sign<T extends JWTPayload>(
  payload: T,
  secret: string,
  { expiresInSeconds = ONE_YEAR }: { expiresInSeconds?: number } = {
    expiresInSeconds: ONE_YEAR,
  },
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expiresInSeconds // one hour

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret))
}

export async function verify<T extends JWTPayload>(
  token: string,
  secret: string,
): Promise<T> {
  const { payload } = (await jwtVerify(
    token,
    new TextEncoder().encode(secret),
  )) as { payload: T }
  // run some checks on the returned payload, perhaps you expect some specific values

  // if its all good, return it, or perhaps just return a boolean
  return payload
}
