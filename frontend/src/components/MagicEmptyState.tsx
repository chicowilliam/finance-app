import { Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import AppButton from './AppButton'
import AppPanel from './AppPanel'

interface MagicEmptyStateProps {
  title: string
  description: string
  eyebrow?: string
  icon: ReactNode
  primaryActionLabel: string
  onPrimaryAction: () => void
}

export default function MagicEmptyState({
  title,
  description,
  eyebrow,
  icon,
  primaryActionLabel,
  onPrimaryAction,
}: MagicEmptyStateProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.12 : 0.28, ease: 'easeOut' }}
    >
      <AppPanel className="magic-empty-state" p="xl">
        <div className="magic-empty-state__glow" />
        <Stack align="flex-start" gap="lg" style={{ position: 'relative', zIndex: 1 }}>
          <Group gap="lg" align="center" wrap="wrap">
            <ThemeIcon radius="xl" size={68} className="magic-empty-state__icon">
              {icon}
            </ThemeIcon>

            <Stack gap={6} maw={560}>
              {eyebrow ? (
                <Text tt="uppercase" fw={800} size="xs" className="magic-empty-state__eyebrow">
                  {eyebrow}
                </Text>
              ) : null}
              <Title order={2} size="h2" style={{ letterSpacing: '-0.03em' }}>
                {title}
              </Title>
              <Text c="dimmed" size="md">
                {description}
              </Text>
            </Stack>
          </Group>

          <Group gap="sm">
            <AppButton className="magic-cta-button" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </AppButton>
          </Group>
        </Stack>
      </AppPanel>
    </motion.div>
  )
}
