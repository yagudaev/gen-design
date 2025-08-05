import { User as DBUser } from '@prisma/client'
import NextAuth, { User as AuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { addToNewsletter } from '@/newsletter'
import { User } from '@/types'

import { hashPassword } from './crypto'
import { prisma } from './db'


type DBUserWithAdmin = DBUser & {
  adminUser: { id: number; userId: number } | null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // TODO: we might get rid of this and use our own login method
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null
        if (
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            adminUser: true,
          },
        })
        if (!user) return null

        const salt = user.passwordSalt ?? ''
        const expectedPasswordHash = user.passwordHash
        const actualPasswordHash = hashPassword(credentials.password, salt)
        if (expectedPasswordHash === actualPasswordHash) {
          return fromDB(user)
        }

        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        if (account?.provider === 'google' && profile?.email) {
          // Fetch the user from DB using email
          const dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { adminUser: true },
          })

          user = { ...user, ...(dbUser ? fromDB(dbUser) : {}) }
        }

        return {
          user: user,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          impersonatingUserId: token.impersonatingUserId,
        }
      }

      return token
    },
    async session({ session, token, user, trigger }) {
      ;(session.user as any) = token.user as User

      // impersonate feature
      if (token.user && (token.user as any).id && (token.user as any).isAdmin) {
        const adminUser = await prisma.user.findUnique({
          where: { id: Number((token.user as DBUser).id) },
          include: {
            adminUser: true,
            impersonatingUser: { include: { adminUser: true } },
          },
        })
        const impersonatingUser = adminUser?.impersonatingUser

        if (impersonatingUser) {
          ;(session.user as any) = fromDB(impersonatingUser)
          // @ts-ignore
          session.impersonating = true
        }
      }

      ;(session as any).accessToken = token.accessToken as string
      ;(session as any).refreshToken = token.refreshToken as string
      ;(session as any).accessTokenExpires = token.accessTokenExpires as string
      return session
    },
    authorized(params) {
      return true
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          include: { adminUser: true },
        })

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              firstName: profile.given_name || '',
              lastName: profile.family_name || '',
            },
            include: { adminUser: true },
          })

          // run in background
          addToNewsletter(newUser)
          return true
        }

        return true
      }
      return true
    },
  },
})

function fromDB(user: DBUserWithAdmin) {
  return {
    id: String(user.id),
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    impersonatingUserId: user.impersonatingUserId,
    isAdmin: !!user.adminUser,
  }
}
