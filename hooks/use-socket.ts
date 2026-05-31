'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

type EventCallback = (data: Record<string, unknown>) => void

export function useChannelRealtime(channelId?: string, onData?: EventCallback) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const lastEventRef = useRef<string>(new Date().toISOString())
  const [connected, setConnected] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const connectRef = useRef<(() => void) | null>(null)

  const connect = useCallback(() => {
    if (!channelId || eventSourceRef.current) return

    const since = lastEventRef.current
    const url = `/api/data/realtime?channelId=${channelId}&since=${encodeURIComponent(since)}`
    const es = new EventSource(url)

    es.onopen = () => setConnected(true)

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        lastEventRef.current = new Date().toISOString()
        onData?.(data)
      } catch {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      setConnected(false)
      eventSourceRef.current?.close()
      eventSourceRef.current = null
      // Reconnect after 3s
      timeoutRef.current = setTimeout(() => connectRef.current?.(), 3000)
    }

    eventSourceRef.current = es
  }, [channelId, onData])

  connectRef.current = connect

  useEffect(() => {
    connect()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      eventSourceRef.current?.close()
      eventSourceRef.current = null
      setConnected(false)
    }
  }, [connect])

  return { connected }
}
