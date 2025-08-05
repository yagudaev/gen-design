import { redirect } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBody } from '@/components/PageBody'
import { WebRTCChat } from '@/components/WebRTCChat'
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = Number(session.user.id)

  return (
    <PageBody>
      {/* header */}
      <div>
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }]} />
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-5xl">Dashboard</h1>
          {/* Page Actions */}
          <div className="flex justify-between mt-8 space-x-4 md:mt-0">
            {/* <Button href="/projects/new">New Project</Button> */}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Voice Assistant</h2>
        <p className="mb-6 text-slate-600">
          Talk with our AI assistant using your voice or text input.
        </p>
        <div className="w-full max-w-3xl p-8 border-2 border-dashed border-slate-300 rounded-lg text-center">
          <p className="text-slate-500">Voice Assistant feature coming soon...</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Audio Synthesis</h2>
        <p className="mb-6 text-slate-600">
          Generate speech from text using GPT-4o TTS.
        </p>
        <div className="w-full max-w-3xl p-8 border-2 border-dashed border-slate-300 rounded-lg text-center">
          <p className="text-slate-500">Audio Synthesis feature coming soon...</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">WebRTC Audio Chat</h2>
        <p className="mb-6 text-slate-600">
          Test our real-time audio communication using WebRTC.
        </p>
        <div className="w-full max-w-3xl">
          <WebRTCChat />
        </div>
      </div>
    </PageBody>
  )
}
