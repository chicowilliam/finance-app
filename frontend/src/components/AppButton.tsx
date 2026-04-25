import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button, type ButtonProps as MantineButtonProps } from '@mantine/core'

type AppButtonTone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger'
type AppButtonAppearance = 'solid' | 'soft' | 'outline'

interface AppButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children?: ReactNode
  leftSection?: ReactNode
  rightSection?: ReactNode
  loading?: boolean
  fullWidth?: boolean
  justify?: MantineButtonProps['justify']
  loaderProps?: MantineButtonProps['loaderProps']
  size?: MantineButtonProps['size']
  radius?: MantineButtonProps['radius']
  tone?: AppButtonTone
  appearance?: AppButtonAppearance
}

interface ButtonPalette {
  bg: string
  bgHover: string
  border: string
  borderHover: string
  color: string
  shadow: string
}

function getPalette(tone: AppButtonTone, appearance: AppButtonAppearance): ButtonPalette {
  const palettes = {
    brand: {
      solid: {
        bg: 'var(--button-brand-solid-bg)',
        bgHover: 'var(--button-brand-solid-hover)',
        border: 'var(--button-brand-solid-border)',
        borderHover: 'var(--button-brand-solid-hover)',
        color: 'var(--button-brand-solid-color)',
        shadow: 'var(--shadow-sm)',
      },
      soft: {
        bg: 'var(--button-brand-soft-bg)',
        bgHover: 'var(--button-brand-soft-hover)',
        border: 'transparent',
        borderHover: 'transparent',
        color: 'var(--button-brand-soft-color)',
        shadow: 'none',
      },
      outline: {
        bg: 'transparent',
        bgHover: 'var(--button-brand-soft-bg)',
        border: 'var(--button-brand-outline-border)',
        borderHover: 'var(--button-brand-outline-hover)',
        color: 'var(--button-brand-outline-color)',
        shadow: 'none',
      },
    },
    neutral: {
      solid: {
        bg: 'var(--button-neutral-solid-bg)',
        bgHover: 'var(--button-neutral-solid-hover)',
        border: 'var(--button-neutral-solid-border)',
        borderHover: 'var(--button-neutral-solid-hover)',
        color: 'var(--button-neutral-solid-color)',
        shadow: 'none',
      },
      soft: {
        bg: 'var(--button-neutral-soft-bg)',
        bgHover: 'var(--button-neutral-soft-hover)',
        border: 'transparent',
        borderHover: 'transparent',
        color: 'var(--button-neutral-soft-color)',
        shadow: 'none',
      },
      outline: {
        bg: 'transparent',
        bgHover: 'var(--button-neutral-soft-bg)',
        border: 'var(--button-neutral-outline-border)',
        borderHover: 'var(--button-neutral-outline-hover)',
        color: 'var(--button-neutral-outline-color)',
        shadow: 'none',
      },
    },
    success: {
      solid: {
        bg: 'var(--button-success-solid-bg)',
        bgHover: 'var(--button-success-solid-hover)',
        border: 'var(--button-success-solid-border)',
        borderHover: 'var(--button-success-solid-hover)',
        color: 'var(--button-success-solid-color)',
        shadow: 'none',
      },
      soft: {
        bg: 'var(--button-success-soft-bg)',
        bgHover: 'var(--button-success-soft-hover)',
        border: 'transparent',
        borderHover: 'transparent',
        color: 'var(--button-success-soft-color)',
        shadow: 'none',
      },
      outline: {
        bg: 'transparent',
        bgHover: 'var(--button-success-soft-bg)',
        border: 'var(--button-success-outline-border)',
        borderHover: 'var(--button-success-outline-hover)',
        color: 'var(--button-success-outline-color)',
        shadow: 'none',
      },
    },
    warning: {
      solid: {
        bg: 'var(--button-warning-solid-bg)',
        bgHover: 'var(--button-warning-solid-hover)',
        border: 'var(--button-warning-solid-border)',
        borderHover: 'var(--button-warning-solid-hover)',
        color: 'var(--button-warning-solid-color)',
        shadow: 'none',
      },
      soft: {
        bg: 'var(--button-warning-soft-bg)',
        bgHover: 'var(--button-warning-soft-hover)',
        border: 'transparent',
        borderHover: 'transparent',
        color: 'var(--button-warning-soft-color)',
        shadow: 'none',
      },
      outline: {
        bg: 'transparent',
        bgHover: 'var(--button-warning-soft-bg)',
        border: 'var(--button-warning-outline-border)',
        borderHover: 'var(--button-warning-outline-hover)',
        color: 'var(--button-warning-outline-color)',
        shadow: 'none',
      },
    },
    danger: {
      solid: {
        bg: 'var(--button-danger-solid-bg)',
        bgHover: 'var(--button-danger-solid-hover)',
        border: 'var(--button-danger-solid-border)',
        borderHover: 'var(--button-danger-solid-hover)',
        color: 'var(--button-danger-solid-color)',
        shadow: 'none',
      },
      soft: {
        bg: 'var(--button-danger-soft-bg)',
        bgHover: 'var(--button-danger-soft-hover)',
        border: 'transparent',
        borderHover: 'transparent',
        color: 'var(--button-danger-soft-color)',
        shadow: 'none',
      },
      outline: {
        bg: 'transparent',
        bgHover: 'var(--button-danger-soft-bg)',
        border: 'var(--button-danger-outline-border)',
        borderHover: 'var(--button-danger-outline-hover)',
        color: 'var(--button-danger-outline-color)',
        shadow: 'none',
      },
    },
  } as const

  return palettes[tone][appearance]
}

export default function AppButton({
  tone = 'brand',
  appearance = 'solid',
  radius = 'md',
  size = 'md',
  ...props
}: AppButtonProps) {
  const palette = getPalette(tone, appearance)

  return (
    <Button
      radius={radius}
      size={size}
      styles={{
        root: {
          minHeight: 42,
          border: `1px solid ${palette.border}`,
          background: palette.bg,
          color: palette.color,
          boxShadow: palette.shadow,
          transition: 'transform 150ms ease, background-color 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            background: palette.bgHover,
            borderColor: palette.borderHover,
            color: palette.color,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: `0 0 0 3px var(--focus-ring-color), ${palette.shadow === 'none' ? 'none' : palette.shadow}`,
          },
          '&[data-disabled], &:disabled': {
            opacity: 0.62,
            transform: 'none',
            boxShadow: 'none',
            cursor: 'not-allowed',
          },
        },
        label: {
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
        section: {
          color: 'inherit',
        },
      }}
      {...props}
    />
  )
}