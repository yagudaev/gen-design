import { cn } from '@workspace/shared/utils'
import React from 'react'

function AnimatedAudioLinesIcon({
  className,
  isPlaying,
}: {
  className?: string
  isPlaying: boolean
}) {
  return (
    <>
      <style jsx>{`
        @keyframes audio-line {
          0% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(0.5);
          }
        }
        .audio-line {
          transform-origin: center;
          animation: audio-line 1s ease-in-out infinite;
          animation-play-state: paused;
        }
        .playing .audio-line {
          animation-play-state: running;
        }
        .line-1 {
          animation-delay: -0.6s;
        }
        .line-2 {
          animation-delay: -0.4s;
        }
        .line-3 {
          animation-delay: -0.2s;
        }
        .line-4 {
          animation-delay: -0.8s;
        }
        .line-5 {
          animation-delay: -0.5s;
        }
        .line-6 {
          animation-delay: -0.3s;
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('lucide lucide-audio-lines', className, {
          playing: isPlaying,
        })}
      >
        <path d="M2 10v3" className="audio-line line-1" />
        <path d="M6 6v11" className="audio-line line-2" />
        <path d="M10 3v18" className="audio-line line-3" />
        <path d="M14 8v7" className="audio-line line-4" />
        <path d="M18 5v13" className="audio-line line-5" />
        <path d="M22 10v3" className="audio-line line-6" />
      </svg>
    </>
  )
}

export default AnimatedAudioLinesIcon
