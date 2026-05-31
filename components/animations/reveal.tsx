'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface RevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  distance?: number
  className?: string
  once?: boolean
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = '',
  once = true,
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!elementRef.current) return

    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0
    const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        x,
        y,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        delay,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 85%',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
      }
    )
  }, { scope: elementRef })

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
