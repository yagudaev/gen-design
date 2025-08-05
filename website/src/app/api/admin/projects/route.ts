import { User as DBUser } from '@prisma/client'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'

export const dynamic = 'force-dynamic'

// export const GET = requireAdminRouteAuth(getHandler)

// async function getHandler(
//   request: Request,
//   authUser: AuthUser,
//   userId: number,
//   options: any,
//   dbUser: DBUser,
// ) {
//   const projects = await prisma.project.findMany({
//     include: {
//       user: {
//         select: {
//           email: true,
//         },
//       },
//     },
//   })

//   return Response.json({
//     status: 'OK',
//     projects,
//   })
// }
