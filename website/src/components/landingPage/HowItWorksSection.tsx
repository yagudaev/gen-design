import React, { useState } from 'react'

import { YoutubeVideo } from '../video/YoutubeVideo'

export function HowItWorksSection({ className = '' }) {
  return (
    <section className={`flex justify-center ${className}`}>
      <div className="flex flex-col items-center justify-center w-full px-8 py-12 max-w-7xl">
        {/* header  */}
        <h2 className="text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Demo 👇
        </h2>

        {/* body */}
        <div className="flex flex-col justify-center w-full h-full max-w-3xl mt-12 ">
          {/* https://youtu.be/sGINEfPgyTU */}
          <YoutubeVideo
            videoId="sGINEfPgyTU"
            title="Video showing how AudioWave works"
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-700 hover:underline"
    >
      {children}
    </a>
  )
}

export default HowItWorksSection
