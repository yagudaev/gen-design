'use client'

import cn from 'clsx'
import Image from 'next/image'
import { useState } from 'react'

export default function BlurImage(props: any) {
  const [isLoading, setLoading] = useState(true)

  return (
    <Image
      {...props}
      alt={props.alt}
      className={cn(
        props.className,
        'duration-700 ease-in-out',
        isLoading
          ? 'scale-110 blur-2xl grayscale'
          : 'scale-100 blur-0 grayscale-0',
      )}
      onLoadingComplete={() => setLoading(false)}
    />
  )
}
