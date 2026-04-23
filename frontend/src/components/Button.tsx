import { motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  const shouldReduceMotion = useReducedMotion()
  const disabled = Boolean(rest.disabled)

  return (
    <motion.button
      className={`btn btn-${variant} ${className}`}
      whileHover={!shouldReduceMotion && !disabled ? { y: -1, scale: 1.01 } : undefined}
      whileTap={!shouldReduceMotion && !disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.45 }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}