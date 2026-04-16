import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, id, ...rest }: InputProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{label}</label>
      <input id={id} className="form-input" {...rest} />
    </div>
  )
}