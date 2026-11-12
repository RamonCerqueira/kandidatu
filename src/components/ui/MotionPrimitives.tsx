import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

/** Filete tricolor oficial da Guiné-Bissau (Vermelho · Amarelo · Verde) com a Estrela Negra opcional */
export function BissauStripe({ className = 'h-1' }: { className?: string }) {
  return (
    <div aria-hidden className={`grid w-full grid-cols-3 overflow-hidden ${className}`}>
      <span className="bg-bissau-red" />
      <span className="bg-bissau-yellow" />
      <span className="bg-bissau-green" />
    </div>
  )
}

/** Emblema da bandeira da Guiné-Bissau com a Estrela Negra de 5 pontas */
export function GuineaBissauBadge({ label = 'Guiné-Bissau' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
      <span aria-hidden className="relative flex h-4 w-6 overflow-hidden rounded-[3px] shadow-sm">
        <span className="flex w-2.5 items-center justify-center bg-bissau-red text-[8px] leading-none text-black">★</span>
        <span className="flex flex-1 flex-col">
          <span className="flex-1 bg-bissau-yellow" />
          <span className="flex-1 bg-bissau-green" />
        </span>
      </span>
      <span>{label}</span>
    </span>
  )
}

/** Ponto pulsante vivo para indicadores em tempo real */
export function PulseDot({ color = 'bg-bissau-green' }: { color?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${color}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  )
}

/** Card com microinteração de elevação, borda iluminada e clique suave */
export function MotionCard({
  children,
  className = '',
  ...rest
}: HTMLMotionProps<'div'> & { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.18, ease: 'easeOut' } }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      className={`card hover:border-brand/30 hover:shadow-lift ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Botão reutilizável com feedback tátil de escala e brilho */
export function MotionButton({
  children,
  className = 'btn-primary',
  ...rest
}: HTMLMotionProps<'button'> & { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      whileHover={reduce ? undefined : { y: -1.5, scale: 1.01 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/** Container que anima os filhos em sequência (stagger) ao entrar na tela */
export function StaggerGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Elemento flutuante suave para compor o Hero */
export function FloatingCard({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={
        reduce
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: [0, -5, 0],
              transition: {
                opacity: { duration: 0.35, delay },
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay },
              },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

