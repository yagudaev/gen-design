'use client'

import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { LucideAudioLines, LucideSearch, LucideSmartphone } from 'lucide-react'
import Image, { type ImageProps } from 'next/image'
import { useId } from 'react'

import { MarketingContainer } from '@/components/MarketingContainer'
import screen1 from '@/images/screenshots/screen-1.png'
import screen2 from '@/images/screenshots/screen-2.png'
import screen3 from '@/images/screenshots/screen-3.png'


interface Feature {
  name: React.ReactNode
  summary: string
  description: string
  image: ImageProps['src']
  icon: React.ComponentType<{ className?: string }>
}

const features: Array<Feature> = [
  {
    name: 'Convert to Audio',
    summary: 'Any text can be converted to audio',
    description:
      'Listen to your favorite articles, blog posts, or any other text content with our AI-powered text-to-speech conversion tool.',
    image: screen1,
    icon: LucideAudioLines,
  },
  {
    name: 'Share & Listen on Mobile',
    summary:
      'Share your audio content with friends and listen on the go with our mobile web app.',
    description:
      'Easily share your favorite audio content with friends and listen on the go with our mobile web app, optimized for all devices.',
    image: screen2,
    icon: LucideSmartphone,
  },
  {
    name: 'Organize Your Content',
    summary:
      'Transform data into actionable insights with our comprehensive analysis tools.',
    description:
      'From market research to customer feedback, our tools help you make sense of your data, offering clear, actionable insights to guide your business strategy.',
    image: screen3,
    icon: LucideSearch,
  },
]

function Feature({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  feature: Feature
  isActive: boolean
}) {
  return (
    <div
      className={clsx(className, !isActive && 'opacity-75 hover:opacity-100')}
      {...props}
    >
      <div
        className={clsx(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          isActive ? 'bg-primary' : 'bg-slate-500',
        )}
      >
        {/* @ts-ignore */}
        <feature.icon
          className={clsx('w-6', isActive ? 'text-white' : 'text-white')}
        />
      </div>
      <h3
        className={clsx(
          'mt-6 text-sm font-medium',
          isActive ? 'text-primary' : 'text-slate-600',
        )}
      >
        {feature.name}
      </h3>
      <p className="mt-2 text-xl font-display text-slate-900">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  )
}

function FeaturesMobile() {
  return (
    <div className="flex flex-col px-4 mt-20 -mx-4 overflow-hidden gap-y-10 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature feature={feature} className="max-w-2xl mx-auto" isActive />
          <div className="relative pb-10 mt-10">
            <div className="absolute bottom-0 -inset-x-4 top-8 bg-slate-200 sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <Image
                className="w-full"
                src={feature.image}
                alt=""
                sizes="52.75rem"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeaturesDesktop() {
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.summary}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="ui-not-focus-visible:outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </Tab.List>
          <Tab.Panels className="relative py-16 mt-20 overflow-hidden rounded-4xl bg-slate-200 px-14 xl:px-16">
            <div className="flex -mx-5">
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  static
                  key={feature.summary}
                  className={clsx(
                    'ui-not-focus-visible:outline-none px-5 transition duration-500 ease-in-out',
                    featureIndex !== selectedIndex && 'opacity-60',
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <Image
                      className="w-full"
                      src={feature.image}
                      alt=""
                      sizes="52.75rem"
                    />
                  </div>
                </Tab.Panel>
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-4xl ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  )
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <MarketingContainer>
        <div className="max-w-2xl mx-auto md:text-center">
          <h2 className="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl">
            Learn and grow with audio 🌱
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Don&apos;t settle for mediocre content, create playlist that inspire
            you
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </MarketingContainer>
    </section>
  )
}
