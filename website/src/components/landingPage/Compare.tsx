'use client'

import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Image, { type ImageProps } from 'next/image'
import { useId } from 'react'

import { MarketingContainer } from '@/components/MarketingContainer'

export function Compare() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pb-20 sm:pt-28 lg:pb-32 bg-slate-50"
    >
      <MarketingContainer>
        <div className="mx-auto max-w-7xl md:text-center">
          <h2 className="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl">
            Audio for humans, not robots 🚫🤖
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Traditional text-to-speech sounds like a rusty robot from the 50s.
            Your ears deserve better{' '}
          </p>
        </div>
        <div className="flex flex-col mt-8 sm:justify-between sm:flex-row">
          <div className="flex flex-col sm:items-center sm:w-1/2">
            <h3 className="text-2xl font-display text-slate-900">
              Traditional text-to-speech 🤖
            </h3>
            <div className="mt-8">
              <audio src="/audio/compare/traditional.mp3" controls />
            </div>
            <ul className="mt-8 text-lg text-slate-700">
              <li>❌ Monotone voice</li>
              <li>❌ Lack of emotion</li>
              <li>❌ Weird pauses</li>
            </ul>
          </div>

          <div className="flex flex-col mt-8 sm:items-center sm:w-1/2 sm:mt-0">
            <h3 className="text-2xl font-display text-slate-900">
              Vibeflow 🦄
            </h3>
            <div className="mt-8">
              <audio src="/audio/compare/vibeflow.mp3" controls />
            </div>
            <ul className="mt-8 text-lg text-slate-700">
              <li>✅ Engaging voice</li>
              <li>✅ Natural sounding</li>
              <li>✅ Enjoyable to listen to</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:text-center">
          <p className="text-lg text-slate-700">
            Listen to the difference for yourself, I dare you to go past 10
            seconds with the traditional
          </p>
        </div>
      </MarketingContainer>
    </section>
  )
}
