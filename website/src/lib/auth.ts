import { User as DBUser } from '@prisma/client'
import NextAuth, { User as AuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { addToNewsletter } from '@/newsletter'
import { User } from '@/types'

// import { hashPassword } from './crypto' // Disabled - password auth removed
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
    // CredentialsProvider disabled - password authentication removed
    // CredentialsProvider({
    //   credentials: {
    //     email: { label: 'Email', type: 'text' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials): Promise<AuthUser | null> {
    //     // Password authentication disabled
    //     return null
    //   },
    // }),
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
          // impersonatingUserId: token.impersonatingUserId, // Removed - field doesn't exist
        }
      }

      return token
    },
    async session({ session, token, user, trigger }) {
      ;(session.user as any) = token.user as User

      // impersonate feature
      if (token.user && (token.user as any).id && (token.user as any).isAdmin) {
        // Impersonation functionality disabled - impersonatingUser relation removed
        const adminUser = await prisma.user.findUnique({
          where: { id: Number((token.user as DBUser).id) },
          include: {
            adminUser: true,
            // impersonatingUser: { include: { adminUser: true } }, // Removed - relation doesn't exist
          },
        })
        // const impersonatingUser = adminUser?.impersonatingUser

        // Impersonation disabled
        // if (impersonatingUser) {
        //   ;(session.user as any) = fromDB(impersonatingUser)
        //   // @ts-ignore
        //   session.impersonating = true
        // }
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
              name: `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || null,
              // firstName: profile.given_name || '', // Removed - field doesn't exist
              // lastName: profile.family_name || '', // Removed - field doesn't exist
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
    name: user.name || '', // Use name field directly since firstName/lastName don't exist
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    // impersonatingUserId: user.impersonatingUserId, // Removed - field doesn't exist
    isAdmin: !!user.adminUser,
  }
}
