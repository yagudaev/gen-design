// Password reset functionality disabled - password fields removed from User model

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // Password reset is disabled since password authentication was removed
  return Response.json(
    {
      error: 'Password reset is not available. Please use Google sign-in instead.',
      status: 'DISABLED',
    },
    { status: 403 }
  )
}

// Legacy password reset function - disabled
// async function resetPassword(userId: number, password: string) {
//   // This functionality is disabled since passwordHash and passwordSalt
//   // fields were removed from the User model
//   throw new Error('Password reset functionality is disabled')
// }
