import { LucideX } from 'lucide-react'
import { useEffect, useState } from 'react'

const launchDate = new Date('2024-05-23T07:01:00.000Z')
const liveUrl = 'https://www.producthunt.com/posts/audiowaveai'
const notifyMeUrl = 'https://www.producthunt.com/products/audiowaveai'

export default function Announcement({ onClose }: { onClose: () => void }) {
  const [secondsUntilLaunch, setSecondsUntilLaunch] = useState(
    Math.floor((launchDate.getTime() - Date.now()) / 1000),
  )
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilLaunch(
        Math.floor((launchDate.getTime() - Date.now()) / 1000),
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative text-white bg-green-900">
      <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium ">
            <span className="md:hidden">We are now on live ProductHunt 🚀</span>
            <span className="hidden md:inline">
              📣 Big news! We launching in {formatTime(secondsUntilLaunch)} on
              ProductHunt
            </span>
            <span className="block sm:ml-2 sm:inline-block">
              <a
                href={secondsUntilLaunch < 0 ? liveUrl : notifyMeUrl}
                className="font-bold underline"
              >
                {' '}
                Learn More <span aria-hidden="true">&rarr;</span>
              </a>
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className="flex p-2 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <LucideX className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number) {
  if (seconds < 0) {
    return 'now'
  }
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${days}d ${hours}h ${minutes}m ${secs}s`
}
