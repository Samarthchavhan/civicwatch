import 'server-only'
import { cookies } from 'next/headers'
import { createHash, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'cw_admin'

/**
 * Derives an opaque session token from the secret PIN. Because the token is a
 * hash of a secret only the operator knows, a visitor cannot forge a valid
 * cookie value even though the cookie name is public.
 */
export function adminToken() {
  const pin = process.env.ADMIN_PIN ?? ''
  return createHash('sha256').update(`civicwatch-admin:${pin}`).digest('hex')
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function pinIsValid(pin: string) {
  const expected = process.env.ADMIN_PIN ?? ''
  if (!expected) return false
  return safeEqual(pin, expected)
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  const value = store.get(ADMIN_COOKIE)?.value
  if (!value) return false
  return safeEqual(value, adminToken())
}
