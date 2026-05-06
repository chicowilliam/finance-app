import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ActionIcon, Badge, Button, Group, Text } from '@mantine/core'
import { X } from '../lib/icons'
import { STORAGE_KEYS } from '../utils/storageKeys'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TourStep {
  id: string
  title: string
  description: string
  target?: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

// ─── Steps ───────────────────────────────────────────────────────────────────

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Finance App! 👋',
    description:
      'Aqui você controla todas as suas finanças de forma simples e visual. Vamos fazer um tour rápido pelas principais funcionalidades.',
    placement: 'center',
  },
  {
    id: 'sidebar-nav',
    title: 'Navegação lateral',
    description:
      'Use o menu lateral para navegar entre as seções: Visão Geral, Contas, Calendário e Alertas. Cada seção tem uma função específica.',
    target: '[data-tour="sidebar-nav"]',
    placement: 'right',
  },
  {
    id: 'btn-saldo',
    title: 'Adicionar Saldo',
    description:
      'Comece adicionando seu saldo disponível. Isso ajuda a calcular quanto sobra após pagar todas as contas em aberto.',
    target: '[data-tour="btn-saldo"]',
    placement: 'bottom',
  },
  {
    id: 'btn-nova-conta',
    title: 'Criar Nova Conta',
    description:
      'Cadastre suas contas a pagar aqui. Defina valor, data de vencimento, categoria e acompanhe o status de cada pagamento.',
    target: '[data-tour="btn-nova-conta"]',
    placement: 'bottom',
  },
  {
    id: 'overview-cards',
    title: 'Resumo do Mês',
    description:
      'Esses cards mostram seu resumo financeiro: saldo disponível, total pago, contas a vencer e contas atrasadas.',
    target: '[data-tour="overview-cards"]',
    placement: 'bottom',
  },
  {
    id: 'finish',
    title: 'Tudo pronto! 🎉',
    description:
      'Você já conhece o essencial. Explore o app à vontade! Para rever este tutorial, acesse as Configurações e clique em "Ver tutorial".',
    placement: 'center',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SPOTLIGHT_PADDING = 10

function getTargetRect(selector: string): Rect | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, width: r.width, height: r.height }
}

function computeTooltipStyle(
  rect: Rect | null,
  placement: TourStep['placement'],
  cardW = 320,
): React.CSSProperties {
  if (!rect || placement === 'center') {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: Math.min(cardW, window.innerWidth - 32),
    }
  }

  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 14

  const sx = rect.x - SPOTLIGHT_PADDING
  const sy = rect.y - SPOTLIGHT_PADDING
  const sw = rect.width + SPOTLIGHT_PADDING * 2
  const sh = rect.height + SPOTLIGHT_PADDING * 2

  const style: React.CSSProperties = {
    position: 'fixed',
    width: Math.min(cardW, vw - 32),
  }

  if (placement === 'bottom') {
    style.top = sy + sh + gap
    style.left = Math.min(Math.max(sx, gap), vw - cardW - gap)
  } else if (placement === 'top') {
    style.bottom = vh - sy + gap
    style.left = Math.min(Math.max(sx, gap), vw - cardW - gap)
  } else if (placement === 'right') {
    style.top = Math.max(sy, gap)
    style.left = sx + sw + gap
  } else if (placement === 'left') {
    style.top = Math.max(sy, gap)
    style.right = vw - sx + gap
  }

  // Clamp inside viewport
  if (typeof style.top === 'number') {
    style.top = Math.max(gap, Math.min(style.top as number, vh - 220))
  }
  if (typeof style.left === 'number') {
    style.left = Math.max(gap, Math.min(style.left as number, vw - cardW - gap))
  }

  return style
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppTour() {
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(false)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const rafRef = useRef<number | undefined>(undefined)

  const currentStep = STEPS[step]

  // Keep spotlight rect in sync with DOM (handles scroll/resize)
  const trackRect = useCallback(() => {
    if (currentStep.target) {
      setTargetRect(getTargetRect(currentStep.target))
    } else {
      setTargetRect(null)
    }
    rafRef.current = requestAnimationFrame(trackRect)
  }, [currentStep])

  useEffect(() => {
    if (active) {
      rafRef.current = requestAnimationFrame(trackRect)
    }
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [active, trackRect])

  // Auto-start on first visit
  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEYS.TOUR_DONE)
    if (!done) {
      const t = setTimeout(() => {
        setStep(0)
        setActive(true)
      }, 700)
      return () => clearTimeout(t)
    }
  }, [])

  // Manual re-trigger via custom event (from SettingsModal)
  useEffect(() => {
    const handler = () => {
      setStep(0)
      setActive(true)
    }
    window.addEventListener('finance:start-tour', handler)
    return () => window.removeEventListener('finance:start-tour', handler)
  }, [])

  function closeTour(markDone = true) {
    setActive(false)
    if (markDone) localStorage.setItem(STORAGE_KEYS.TOUR_DONE, '1')
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      closeTour()
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1)
  }

  if (!active) return null

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 720

  const sx = targetRect ? targetRect.x - SPOTLIGHT_PADDING : 0
  const sy = targetRect ? targetRect.y - SPOTLIGHT_PADDING : 0
  const sw = targetRect ? targetRect.width + SPOTLIGHT_PADDING * 2 : 0
  const sh = targetRect ? targetRect.height + SPOTLIGHT_PADDING * 2 : 0

  const tooltipStyle = computeTooltipStyle(targetRect, currentStep.placement)
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  return (
    <AnimatePresence>
      <>
        {/* ── Blur backdrop ── */}
        <motion.div
          key="tour-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 9990,
            pointerEvents: 'none',
          }}
        />

        {/* ── SVG spotlight overlay ── */}
        <motion.svg
          key="tour-svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 9991,
            pointerEvents: 'all',
            cursor: 'default',
          }}
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => closeTour()}
        >
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x={0} y={0} width={vw} height={vh} fill="white" />
              {targetRect && (
                <rect
                  x={sx}
                  y={sy}
                  width={sw}
                  height={sh}
                  rx={12}
                  ry={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x={0}
            y={0}
            width={vw}
            height={vh}
            fill="rgba(0,0,0,0.62)"
            mask="url(#tour-spotlight-mask)"
          />
        </motion.svg>

        {/* ── Spotlight border glow ── */}
        {targetRect && (
          <motion.div
            key={`glow-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: sy,
              left: sx,
              width: sw,
              height: sh,
              borderRadius: 12,
              outline: '2px solid rgba(32,201,151,0.55)',
              outlineOffset: 0,
              boxShadow: '0 0 24px rgba(32,201,151,0.25)',
              zIndex: 9992,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Tooltip card ── */}
        <motion.div
          key={`tour-card-${step}`}
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            ...tooltipStyle,
            zIndex: 9995,
            pointerEvents: 'all',
          }}
        >
          <div
            style={{
              background: 'var(--color-surface, #1c1c1c)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '18px 18px 14px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            {/* Header row */}
            <Group justify="space-between" mb={10} wrap="nowrap">
              <Badge size="xs" variant="light" color="teal" radius="sm">
                {step + 1} / {STEPS.length}
              </Badge>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                onClick={() => closeTour()}
                aria-label="Fechar tour"
              >
                <X size={13} />
              </ActionIcon>
            </Group>

            {/* Title */}
            <Text fw={600} size="sm" mb={6} c="var(--color-text)">
              {currentStep.title}
            </Text>

            {/* Description */}
            <Text size="xs" c="dimmed" mb={16} style={{ lineHeight: 1.6 }}>
              {currentStep.description}
            </Text>

            {/* Progress dots */}
            <Group gap={5} justify="center" mb={14}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? 22 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i === step
                        ? 'var(--mantine-color-teal-5, #20c997)'
                        : i < step
                          ? 'rgba(32,201,151,0.35)'
                          : 'rgba(255,255,255,0.12)',
                    transition: 'width 0.28s ease, background 0.2s',
                  }}
                />
              ))}
            </Group>

            {/* Action buttons */}
            <Group justify="space-between">
              {!isFirst ? (
                <Button size="xs" variant="subtle" color="gray" onClick={prev}>
                  ← Anterior
                </Button>
              ) : (
                <Button size="xs" variant="subtle" color="gray" onClick={() => closeTour()}>
                  Pular tour
                </Button>
              )}
              <Button size="xs" color="teal" onClick={next}>
                {isLast ? 'Concluir ✓' : 'Próximo →'}
              </Button>
            </Group>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
