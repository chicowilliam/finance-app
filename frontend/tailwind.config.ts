import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        brand: 'var(--color-brand)',
        'brand-strong': 'var(--color-brand-strong)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        appbg: 'var(--color-bg)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        sidebar: 'var(--color-sidebar)',
        'sidebar-text': 'var(--color-sidebar-text)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
        },
        status: {
          paid: 'var(--status-paid)',
          'paid-bg': 'var(--status-paid-bg)',
          due: 'var(--status-due)',
          'due-bg': 'var(--status-due-bg)',
          late: 'var(--status-late)',
          'late-bg': 'var(--status-late-bg)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
      },
    },
  },
}

export default config
