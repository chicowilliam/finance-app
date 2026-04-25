import {
  NumberInput,
  PasswordInput,
  Select,
  TextInput,
  type NumberInputProps,
  type PasswordInputProps,
  type SelectProps,
  type TextInputProps,
} from '@mantine/core'

function getSharedInputStyles() {
  return {
    label: {
      color: 'var(--color-text)',
      fontWeight: 600,
      marginBottom: 6,
    },
    input: {
      minHeight: 42,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--input-border)',
      background: 'var(--input-bg)',
      color: 'var(--input-text)',
      transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
      '&::placeholder': {
        color: 'var(--input-placeholder)',
      },
      '&:hover': {
        borderColor: 'var(--input-border-hover)',
      },
      '&:focus, &:focus-within': {
        borderColor: 'var(--input-border-focus)',
        boxShadow: '0 0 0 3px var(--focus-ring-color)',
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
        background: 'var(--input-bg-disabled)',
      },
      '&[data-invalid]': {
        borderColor: 'var(--input-border-error)',
        boxShadow: '0 0 0 3px var(--input-ring-error)',
      },
    },
    section: {
      color: 'var(--input-placeholder)',
    },
    error: {
      color: 'var(--input-text-error)',
      fontWeight: 500,
      marginTop: 6,
    },
    description: {
      color: 'var(--color-text-muted)',
      marginTop: 6,
    },
  }
}

export function AppInput(props: TextInputProps) {
  return <TextInput {...props} styles={getSharedInputStyles()} />
}

export function AppPasswordInput(props: PasswordInputProps) {
  return <PasswordInput {...props} styles={getSharedInputStyles()} />
}

export function AppSelect(props: SelectProps) {
  return <Select {...props} styles={getSharedInputStyles()} />
}

export function AppNumberInput(props: NumberInputProps) {
  return <NumberInput {...props} styles={getSharedInputStyles()} />
}
