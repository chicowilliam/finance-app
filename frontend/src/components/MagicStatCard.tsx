import { Badge, Group, Stack, Text } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import AppPanel from './AppPanel'
import CountUpValue from './CountUpValue'

type MagicStatTone = 'emerald' | 'amber' | 'rose' | 'teal'

interface MagicStatCardProps {
  label: string
  value: number
  quantity: number
  description: string
  tone?: MagicStatTone
  formatter?: (value: number) => string
  icon?: ReactNode
}

const toneMap: Record<MagicStatTone, { glow: string; border: string; badge: string; badgeText: string }> = {
  emerald: {
    glow: 'radial-gradient(circle at top, rgba(34, 197, 94, 0.22), transparent 58%)',
    border: 'rgba(34, 197, 94, 0.3)',
    badge: 'rgba(34, 197, 94, 0.14)',
    badgeText: '#16a34a',
  },
  amber: {
    glow: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.24), transparent 58%)',
    border: 'rgba(251, 191, 36, 0.32)',
    badge: 'rgba(251, 191, 36, 0.16)',
    badgeText: '#b7791f',
  },
  rose: {
    glow: 'radial-gradient(circle at top, rgba(248, 113, 113, 0.22), transparent 58%)',
    border: 'rgba(248, 113, 113, 0.3)',
    badge: 'rgba(248, 113, 113, 0.14)',
    badgeText: '#dc2626',
  },
  teal: {
    glow: 'radial-gradient(circle at top, rgba(45, 212, 191, 0.22), transparent 58%)',
    border: 'rgba(45, 212, 191, 0.28)',
    badge: 'rgba(45, 212, 191, 0.14)',
    badgeText: '#0f766e',
  },
}

export default function MagicStatCard({
  label,
  value,
  quantity,
  description,
  tone = 'teal',
  formatter,
  icon,
}: MagicStatCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const palette = toneMap[tone]

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ duration: shouldReduceMotion ? 0.12 : 0.26, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      <AppPanel className="magic-stat-card" style={{ height: '100%' }}>
        <div className="magic-stat-card__backdrop" style={{ background: palette.glow }} />
        <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap={4}>
              <Text c="dimmed" size="sm" fw={600}>{label}</Text>
              <Text fw={900} size="2rem" lh={1.05} style={{ letterSpacing: '-0.04em' }}>
                <CountUpValue value={value} formatter={formatter} />
              </Text>
            </Stack>
            {icon ? <div className="magic-stat-card__icon">{icon}</div> : null}
          </Group>

          <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
            <Badge
              variant="light"
              radius="xl"
              styles={{
                root: {
                  background: palette.badge,
                  color: palette.badgeText,
                  border: `1px solid ${palette.border}`,
                  textTransform: 'none',
                },
              }}
            >
              {quantity} conta{quantity !== 1 ? 's' : ''}
            </Badge>
            <Text size="sm" c="dimmed" ta="right">
              {description}
            </Text>
          </Group>
        </Stack>
      </AppPanel>
    </motion.div>
  )
}
