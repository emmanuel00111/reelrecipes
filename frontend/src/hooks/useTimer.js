import { useState, useEffect, useRef } from 'react'

export function useTimer(minutes) {
  const [remaining, setRemaining] = useState(null)
  const [running, setRunning] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = setInterval(() => setRemaining(r => r - 1), 1000)
    } else if (remaining === 0) {
      setRunning(false)
    }
    return () => clearInterval(ref.current)
  }, [running, remaining])

  const start = () => { setRemaining(minutes * 60); setRunning(true) }
  const stop = () => { setRunning(false); setRemaining(null) }

  const display = remaining === null ? null :
    `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`

  return { running, remaining, display, start, stop, done: remaining === 0 }
}
