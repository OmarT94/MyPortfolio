import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const directions = {
    up:    { y: 40,  x: 0   },
    down:  { y: -40, x: 0   },
    left:  { y: 0,   x: 40  },
    right: { y: 0,   x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView
        ? { opacity: 1, y: 0, x: 0 }
        : { opacity: 0, ...directions[direction] }
      }
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger — يظهر العناصر بالتتابع ─────────────────────────────────────────
export const StaggerContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden:  { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    }}
    className={className}
  >
    {children}
  </motion.div>
)
