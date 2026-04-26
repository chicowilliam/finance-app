import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

interface CountUpValueProps {
  value: number
  duration?: number
  formatter?: (value: number) => string
}

export default function CountUpValue({
  value,
  duration = 800,
  formatter = (next) => String(Math.round(next)),
}: CountUpValueProps) {
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(value)
  const previousValueRef = useRef(value)

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value)
      previousValueRef.current = value
      return
    }

    const start = performance.now()
    const from = previousValueRef.current
    const delta = value - from
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(from + delta * eased)

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    previousValueRef.current = value
    return () => cancelAnimationFrame(frame)
  }, [duration, shouldReduceMotion, value])

  const formattedValue = useMemo(() => formatter(displayValue), [displayValue, formatter])

  return <>{formattedValue}</>
}
