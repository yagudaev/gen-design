'use client'

import { cn } from '@workspace/shared/utils'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

import VideoPlaceholder from '../../images/placeholders/youtube-video.png'


export function YoutubeVideo({
  videoId,
  title,
  alt,
  width = 889,
  height = 500,
  className = '',
  ...props
}: {
  videoId: string
  title: string
  height?: number
  width?: number
  className?: string
  alt?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const { isIntersecting } = useIntersectionObserver(containerRef)

  useEffect(() => {
    if (isIntersecting) {
      setShow(true)
    }
  }, [isIntersecting])

  return (
    <div
      ref={containerRef}
      // className={cn('aspect-w-16 aspect-h-9', className)}
      className="mx-auto h-[56.25vw] max-h-[500px] w-full"
      {...props}
    >
      {!show && (
        <Image
          width={width}
          height={height}
          src={VideoPlaceholder}
          alt={alt ?? 'Youtube Video Cover'}
        />
      )}
      {show && (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        />
      )}
    </div>
  )
}

export default YoutubeVideo
