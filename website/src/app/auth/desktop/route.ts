import { signIn } from '@/lib/auth'

// Route handler for server-side redirect to Google OAuth
export async function GET() {
  // Build the callback URL for desktop
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://www.vibeflow.sh'
      : 'http://localhost:3000'

  const callbackUrl = `${baseUrl}/auth/desktop/callback`

  // Use NextAuth's signIn function for server-side redirect
  // This will automatically redirect to Google OAuth
  await signIn('google', {
    redirectTo: callbackUrl,
  })
}
