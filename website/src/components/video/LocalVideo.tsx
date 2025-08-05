import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

import VideoPlaceholder from '../../assets/images/placeholders/local-video.png'

export function LocalVideo({
  src,
  title,
  alt,
  ...props
}: {
  src: string
  title: string
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
    <div ref={containerRef} className="" {...props}>
      {!show && (
        <Image
          width={576}
          height={324}
          src={VideoPlaceholder}
          alt={alt ?? 'Video cover'}
        />
      )}
      {show && (
        <video
          className="mx-auto mt-6 w-full md:mr-6 md:mt-0 md:max-w-xl"
          autoPlay
          loop
          controls
          muted
          playsInline
          title={title}
          width={576}
          height={324}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

export default LocalVideo
