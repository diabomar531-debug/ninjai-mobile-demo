import { AnimatePresence, motion } from 'framer-motion'

export function BalanceDisplay({ value, compact = false }: { value: number; compact?: boolean }) {
  const decimals = value % 1 === 0 ? 2 : 4

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={compact ? 'text-xl font-bold text-[#F6F8FB]' : 'text-[28px] font-bold leading-none text-[#F6F8FB]'}
        >
          ${value.toFixed(decimals)}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
