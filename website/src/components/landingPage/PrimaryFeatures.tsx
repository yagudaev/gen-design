'use client'

import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { MarketingContainer } from '@/components/MarketingContainer'
import backgroundImage from '@/images/background-features.jpg'
import screenshotDataAnalysis from '@/images/screenshots/vat-returns.png'

import screenshotMarketResearch from '@/images/screenshots/expenses.png'
import screenshotBusinessValidation from '@/images/screenshots/payroll.png'
import screenshotUXResearch from '@/images/screenshots/reporting.png'

const features = [
  {
    title: 'AI-Driven Market Research',
    description:
      'Leverage advanced AI to uncover market trends, customer needs, and competitive landscapes in real-time.',
    image: screenshotMarketResearch,
  },
  {
    title: 'Business Idea Validation',
    description:
      'Use AI to assess the viability of your business concepts, saving time and resources on market testing.',
    image: screenshotBusinessValidation,
  },
  {
    title: 'Enhanced UX Research',
    description:
      "Improve your product's user experience with AI-generated insights into user behaviors and preferences.",
    image: screenshotUXResearch,
  },
  {
    title: 'In-depth Data Analysis',
    description:
      'Delve into comprehensive data analysis with AI, providing actionable insights for informed decision-making.',
    image: screenshotDataAnalysis,
  },
]

export function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for enhancing your research"
      className="overflow-hidden relative pt-20 pb-28 bg-brand-orange sm:py-32"
      style={{
        background: 'linear-gradient(#e0bfa5, #f8d15c)',
      }}
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <MarketingContainer className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="text-3xl tracking-tight text-black font-display sm:text-4xl md:text-5xl">
            Empower Your Research with AI.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-grey-600">
            {'Vibeflow'} brings you the cutting-edge AI tools for market
            research, idea validation, UX studies, and data analysis.
          </p>
        </div>
        <Tab.Group
          as="div"
          className="grid grid-cols-1 gap-y-2 items-center pt-10 mt-16 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="flex overflow-x-auto pb-4 -mx-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="flex relative z-10 gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display ui-not-focus-visible:outline-none text-lg',
                            selectedIndex === featureIndex
                              ? 'text-brand-orange lg:text-black'
                              : 'text-grey-600 hover:text-black lg:text-black',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-black'
                            : 'text-grey-600 group-hover:text-black',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-black sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <Image
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </MarketingContainer>
    </section>
  )
}
