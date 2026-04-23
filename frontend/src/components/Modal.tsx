import type { ReactNode } from 'react'
import { X } from '../lib/icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}><X size={18} strokeWidth={1.5} /></button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}