// import { prisma } from '@/lib/db'

type AuthorizeOptions = {
  allowPublic?: boolean
}

function isAuthorized(
  project: { userId: number; public?: boolean } | null,
  userId: number | null,
  { allowPublic = false }: AuthorizeOptions = {},
) {
  if (!project) return false

  if (allowPublic && project.public) return true

  if (project.userId === userId) return true

  return false
}

// Base authorize function
// export async function authorizeProject(
//   projectId: number,
//   userId: number | null,
//   options: AuthorizeOptions = {},
// ) {
//   const project = await prisma.project.findUnique({
//     where: { id: projectId },
//   })

//   return isAuthorized(project, userId, options) ? project : null
// }

// // Specialized version with chapters
// export async function authorizeProjectWithChapters(
//   projectId: number,
//   userId: number | null,
//   options: AuthorizeOptions = {},
// ) {
//   const project = await prisma.project.findUnique({
//     where: { id: projectId },
//     include: {
//       chapters: {
//         include: {
//           project: true,
//           versions: {
//             include: { chunks: true },
//           },
//         },
//       },
//     },
//   })

//   return isAuthorized(project, userId, options) ? project : null
// }
