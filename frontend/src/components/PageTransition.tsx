import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', scale: 0.995 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)', scale: 0.995 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.14, ease: 'easeOut' }
          : { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
      }
    >
      {children}
    </motion.div>
  )
}