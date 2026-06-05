import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function AskPill({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="group absolute left-6 top-[260px] z-30 flex h-[38px] items-center gap-2 rounded-full border border-[#63F7D4]/35 bg-[#10141C]/95 px-4 text-sm font-semibold text-[#F6F8FB] shadow-[0_0_34px_rgba(99,247,212,0.22)] backdrop-blur-xl sm:left-[52%] sm:top-[360px]"
    >
      <Sparkles className="h-4 w-4 text-[#63F7D4]" />
      Ask Ninjai
      <span className="pointer-events-none absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#273041] bg-[#10141C] px-3 py-1.5 text-xs font-medium text-[#A7B0C0] opacity-0 shadow-xl transition group-hover:opacity-100">
        Use your AI wallet here
      </span>
    </motion.button>
  )
}
