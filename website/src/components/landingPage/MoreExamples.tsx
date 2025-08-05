'use client'

import { Tab } from '@headlessui/react'
import { cn } from '@workspace/shared/utils'
import clsx from 'clsx'
import Image, { StaticImageData, type ImageProps } from 'next/image'
import Link from 'next/link'
import React, { useId } from 'react'
import ReactMarkdown from 'react-markdown'

import { MarketingContainer } from '@/components/MarketingContainer'
import { Card } from '@/components/ui/card'
import amyHoyAvatar from '@/images/examples/amy-hoy.jpg'
import article3Image from '@/images/examples/article-3.webp'
import danielVassalloAvatar from '@/images/examples/daniel-vassallo.jpg'
import paulGrahamAvatar from '@/images/examples/paual-graham.jpg'


export function MoreExamples() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <MarketingContainer>
        <div className="mx-auto max-w-7xl md:text-center">
          <h2 className="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl">
            More Examples
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Listen, learn, relax and enjoy the power of great audio 😌🎧
          </p>
        </div>
        <div className="flex flex-col w-full mt-8 space-y-8">
          <Example
            title="How to start a startup"
            description={`
March 2005

(This essay is derived from a talk at the Harvard Computer Society.)

You need three things to create a successful startup: to start with good people, to make something customers actually want, and to spend as little money as possible. Most startups that fail do it because they fail at one of these. A startup that does all three will probably succee...
          `}
            audioSrc="https://hispp5xuhwtenshp.public.blob.vercel-storage.com/users/1/chapters/213/ovmny-VrGQjgDD089NmwotSdHodHD9R3p1nX.mp3"
            imageUrl="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            authorName="Paul Graham"
            authorTitle="Co-founder of Y Combinator"
            authorSrc={paulGrahamAvatar}
            readMoreUrl="https://www.audiowaveai.com/p/213-how-to-start-a-startup"
          />

          <Example
            title="Why you shouldn't apply to YC"
            description={`
The deadline for YC S24 is tomorrow. Here's why you SHOULD NOT APPLY TO YC:

YC seems like a reasonable proposition. They give you some money to help start your business, and they promise you access to a community of people that can help you along the way. In exchange, they don't ask for much. The standard YC deal is $500K for 7% equity...
          `}
            audioSrc="https://hispp5xuhwtenshp.public.blob.vercel-storage.com/users/1/chapters/753/ok7a89-RGAiUDZNKbyLZqD9lJ7AIjP0prhbEF.mp3"
            authorName="Daniel Vassallo"
            authorTitle="Founder of Small Bets"
            authorSrc={danielVassalloAvatar}
            imageUrl="https://images.unsplash.com/photo-1518946222227-364f22132616?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alternate
            readMoreUrl="https://www.audiowaveai.com/p/70-why-you-shouldnt-apply-to-yc"
          />

          {/* <Example
            title="8 Products perfect for designers to make"
            description={`
Hey Designers—8 Perfect Products You Can Make

Designers, this post is for you.

I’m not sure if you know this, but I am a designer first and foremost. I fell in love with pixels at a young age. And I learned to code because of how much I loved to design, not in spite of it.
          `}
            audioSrc="https://hispp5xuhwtenshp.public.blob.vercel-storage.com/users/1/chapters/992/ot21d8-VqTARcdF47JzwJq8QmDWRu91A7BXlH.mp3"
            imageUrl={article3Image}
            authorName="Amy Hoy"
            authorTitle="Co-founder of 30x500"
            authorSrc={amyHoyAvatar}
            readMoreUrl="https://www.audiowaveai.com/p/92-8-perfect-products-for-designer-to-make"
          /> */}
        </div>
      </MarketingContainer>
    </section>
  )
}

export default function Example({
  title,
  description,
  audioSrc,
  authorName,
  authorSrc,
  authorTitle,
  readMoreUrl,
  alternate = false,
  imageUrl,
}: {
  title: string
  description: string
  audioSrc: string
  authorName: string
  authorTitle: string
  authorSrc: string | StaticImageData
  readMoreUrl: string
  alternate?: boolean
  imageUrl: string | StaticImageData
}) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center w-full gap-6 p-6 bg-white rounded-lg shadow-lg sm:flex-row sm:items-start sm:p-8 dark:bg-gray-900',
        alternate && '!flex-row-reverse',
      )}
    >
      <div className="relative w-full sm:w-1/2 aspect-[3/2] overflow-hidden rounded-lg">
        <Image
          alt="Article Illustration"
          className="object-cover"
          fill
          // height="400"
          src={imageUrl}
          style={{
            aspectRatio: '600/400',
            objectFit: 'cover',
          }}
          // width="600"
        />
      </div>
      <div className="w-full space-y-4 sm:w-1/2">
        <div className="flex items-center gap-4">
          <Image
            alt="Author Portrait"
            className="w-16 h-16 rounded-full"
            height="64"
            src={authorSrc}
            style={{
              aspectRatio: '64/64',
              objectFit: 'cover',
            }}
            width="64"
          />
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <h3 className="text-lg font-semibold">{authorName}</h3>
            <p className="text-gray-500 dark:text-gray-400">{authorTitle}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <audio className="w-full" controls>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div className="mt-4 text-gray-500 dark:text-gray-400 prose">
            <ReactMarkdown>{description}</ReactMarkdown>
            <Link className="flex mt-2 underline" href={readMoreUrl}>
              Read more
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
