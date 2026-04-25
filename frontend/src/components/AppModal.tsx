import { Modal, type ModalProps } from '@mantine/core'

export default function AppModal(props: ModalProps) {
  return (
    <Modal
      centered
      radius="lg"
      overlayProps={{ blur: 2, backgroundOpacity: 0.45 }}
      styles={{
        content: {
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          boxShadow: 'var(--panel-shadow)',
        },
        title: {
          color: 'var(--color-text)',
          fontWeight: 700,
        },
      }}
      {...props}
    />
  )
}
