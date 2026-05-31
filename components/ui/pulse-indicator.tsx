'use client'

import { cn } from "@/lib/utils"

interface PulseIndicatorProps {
  className?: string
  color?: "violet" | "emerald" | "blue" | "rose" | "amber"
  size?: "sm" | "md" | "lg"
}

export function PulseIndicator({ 
  className, 
  color = "violet",
  size = "md" 
}: PulseIndicatorProps) {
  const colorMap = {
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  }

  const sizeMap = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4",
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeMap[size], className)}>
      <span className={cn(
        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
        colorMap[color]
      )}></span>
      <span className={cn(
        "relative inline-flex rounded-full",
        sizeMap[size],
        colorMap[color]
      )}></span>
    </div>
  )
}
