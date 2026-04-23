import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.14, ease: 'easeOut' }
          : { duration: 0.26, ease: 'easeOut' }
      }
    >
      {children}
    </motion.div>
  )
}