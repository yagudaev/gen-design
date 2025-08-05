'use client'

import { useEffect, useState } from 'react'

export function useTitle(
  initialTitle?: string,
  { postfix = ' - VibeFlow' } = {},
) {
  const documentTitle = typeof document !== 'undefined' ? document.title : ''
  const [title, setTitle] = useState(initialTitle || documentTitle)
  const [titlePostfix, setPostfix] = useState(postfix)

  useEffect(() => {
    document.title = `${title}${titlePostfix}`
  }, [title, titlePostfix])

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle)
    }
  }, [initialTitle])

  return { title, setTitle, setPostfix }
}

export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    sm: typeof window !== 'undefined' && window.innerWidth >= 640,
    md: typeof window === 'undefined' || window.innerWidth >= 768, // default to true if window is undefined
    lg: typeof window !== 'undefined' && window.innerWidth >= 1024,
    xl: typeof window !== 'undefined' && window.innerWidth >= 1280,
    '2xl': typeof window !== 'undefined' && window.innerWidth >= 1536,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        sm: window.innerWidth >= 640,
        md: window.innerWidth >= 768,
        lg: window.innerWidth >= 1024,
        xl: window.innerWidth >= 1280,
        '2xl': window.innerWidth >= 1536,
      })
    }

    window.addEventListener('resize', handleResize)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return screenSize
}
