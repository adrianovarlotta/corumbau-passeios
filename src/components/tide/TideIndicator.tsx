'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, ArrowDown, Waves } from 'lucide-react'

interface TideData {
  height: number
  status: 'alta' | 'baixa' | 'meia'
  direction: 'subindo' | 'baixando'
  nextEvent: {
    type: 'alta' | 'baixa'
    time: string
    height: number
  }
}

export function TideIndicator() {
  const [tide, setTide] = useState<TideData | null>(null)

  useEffect(() => {
    async function fetchTide() {
      try {
        const res = await fetch('/api/tide')
        const json = await res.json()
        if (json.success && json.data) {
          setTide(json.data)
        }
      } catch {
        // Silently fail — tide is non-critical
      }
    }

    fetchTide()
    // Refresh every 10 minutes
    const interval = setInterval(fetchTide, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (!tide) return null

  const isRising = tide.direction === 'subindo'

  return (
    <div className="flex items-center gap-2">
      {/* Waves icon + direction arrow */}
      <div className="flex items-center gap-0.5">
        <Waves className="h-5 w-5 text-sky-200" />
        {isRising ? (
          <ArrowUp className="h-4 w-4 text-sky-300" />
        ) : (
          <ArrowDown className="h-4 w-4 text-amber-300" />
        )}
      </div>

      {/* Height + status */}
      <div className="flex flex-col items-end leading-tight">
        <span className="font-bold text-white tabular-nums text-base">
          {tide.height.toFixed(1)}m
        </span>
        <span className="text-xs text-white/80 capitalize font-medium">
          {tide.direction}
        </span>
      </div>
    </div>
  )
}
