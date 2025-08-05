import sha1 from 'sha1'

export function createSalt() {
  return Math.random().toString(36).substring(7)
}
export function hashPassword(password: string, salt: string) {
  return sha1(password + salt)
}
