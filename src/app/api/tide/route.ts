import { NextResponse } from 'next/server'

// Porto mais próximo de Corumbau: Ilhéus (ba04)
const HARBOR_ID = 'ba04'
const API_BASE = 'https://tabuamare.devtu.qzz.io/api/v2'

interface TideEvent {
  hour: string   // "05:36:00"
  level: number  // 1.98
}

interface TideResponse {
  height: number
  status: 'alta' | 'baixa' | 'meia'
  direction: 'subindo' | 'baixando'
  nextEvent: {
    type: 'alta' | 'baixa'
    time: string
    height: number
  }
  events: Array<{ time: string; height: number; type: 'alta' | 'baixa' }>
  source: string
}

function parseTime(timeStr: string): Date {
  const now = new Date()
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0)
  return d
}

function calculateCurrentTide(events: TideEvent[]): TideResponse {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Parse events with types (alternating high/low based on levels)
  const parsed = events.map((e, i) => {
    const [h, m] = e.hour.split(':').map(Number)
    const minutes = h * 60 + m
    // Determine if high or low by comparing to neighbors
    const isHigh = events.every((other, j) => j === i || e.level >= other.level) ||
      (i > 0 && i < events.length - 1 && e.level > events[i - 1].level && e.level > events[i + 1].level) ||
      (i === 0 && events.length > 1 && e.level > events[1].level) ||
      (i === events.length - 1 && events.length > 1 && e.level > events[events.length - 2].level)

    return {
      time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      height: Math.round(e.level * 10) / 10,
      type: isHigh ? 'alta' as const : 'baixa' as const,
      minutes,
    }
  })

  // Find where we are between events
  let prevEvent = parsed[parsed.length - 1] // wrap around
  let nextEvent = parsed[0]

  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i].minutes > currentMinutes) {
      nextEvent = parsed[i]
      prevEvent = i > 0 ? parsed[i - 1] : parsed[parsed.length - 1]
      break
    }
    if (i === parsed.length - 1) {
      // We're past all events today
      prevEvent = parsed[i]
      nextEvent = parsed[0] // tomorrow's first event
    }
  }

  // Interpolate current height
  const prevMinutes = prevEvent.minutes
  const nextMinutes = nextEvent.minutes > prevMinutes ? nextEvent.minutes : nextEvent.minutes + 1440
  const adjustedCurrent = currentMinutes >= prevMinutes ? currentMinutes : currentMinutes + 1440
  const progress = Math.max(0, Math.min(1,
    (adjustedCurrent - prevMinutes) / (nextMinutes - prevMinutes)
  ))

  // Cosine interpolation for smoother tide curve
  const cosProgress = (1 - Math.cos(progress * Math.PI)) / 2
  const height = prevEvent.height + (nextEvent.height - prevEvent.height) * cosProgress

  // Determine direction
  const direction = nextEvent.type === 'alta' ? 'subindo' as const : 'baixando' as const

  // Determine status
  let status: 'alta' | 'baixa' | 'meia'
  const range = Math.max(...parsed.map(p => p.height)) - Math.min(...parsed.map(p => p.height))
  const midLevel = (Math.max(...parsed.map(p => p.height)) + Math.min(...parsed.map(p => p.height))) / 2
  if (height > midLevel + range * 0.2) status = 'alta'
  else if (height < midLevel - range * 0.2) status = 'baixa'
  else status = 'meia'

  return {
    height: Math.round(height * 10) / 10,
    status,
    direction,
    nextEvent: {
      type: nextEvent.type,
      time: nextEvent.time,
      height: nextEvent.height,
    },
    events: parsed.map(p => ({ time: p.time, height: p.height, type: p.type })),
    source: 'Tábua de Marés - Marinha do Brasil (Ilhéus/BA)',
  }
}

// Cache the tide data for 1 hour
let cachedData: { events: TideEvent[]; date: string; fetchedAt: number } | null = null

export async function GET() {
  const now = new Date()
  const today = now.getDate()
  const month = now.getMonth() + 1
  const dateKey = `${month}-${today}`

  // Check cache (1 hour TTL)
  if (cachedData && cachedData.date === dateKey && Date.now() - cachedData.fetchedAt < 3600000) {
    const tide = calculateCurrentTide(cachedData.events)
    return NextResponse.json({ data: tide, success: true, cached: true })
  }

  try {
    const url = `${API_BASE}/tabua-mare/${HARBOR_ID}/${month}/[${today}]`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`)
    }

    const json = await res.json()
    const dayData = json.data?.[0]?.months?.[0]?.days?.[0]

    if (!dayData || !dayData.hours || dayData.hours.length === 0) {
      throw new Error('No tide data available')
    }

    const events: TideEvent[] = dayData.hours

    // Cache it
    cachedData = { events, date: dateKey, fetchedAt: Date.now() }

    const tide = calculateCurrentTide(events)
    return NextResponse.json({ data: tide, success: true, cached: false })
  } catch (error) {
    console.error('Failed to fetch tide data:', error)

    // If we have stale cached data, use it
    if (cachedData) {
      const tide = calculateCurrentTide(cachedData.events)
      return NextResponse.json({ data: tide, success: true, stale: true })
    }

    return NextResponse.json({
      error: 'Dados de maré indisponíveis',
      success: false,
    }, { status: 503 })
  }
}
