import { Paper, type PaperProps } from '@mantine/core'
import type { ReactNode } from 'react'

type AppPanelTone = 'default' | 'subtle'

interface AppPanelProps extends Omit<PaperProps, 'children'> {
  children: ReactNode
  tone?: AppPanelTone
}

export default function AppPanel({
  children,
  tone = 'default',
  withBorder = true,
  radius = 'lg',
  p = 'md',
  ...props
}: AppPanelProps) {
  const isSubtle = tone === 'subtle'

  return (
    <Paper
      withBorder={withBorder}
      radius={radius}
      p={p}
      styles={{
        root: {
          background: isSubtle ? 'var(--panel-subtle-bg)' : 'var(--panel-bg)',
          borderColor: 'var(--panel-border)',
          boxShadow: isSubtle ? 'none' : 'var(--panel-shadow)',
        },
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}
