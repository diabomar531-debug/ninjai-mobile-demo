import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Copy, MessageCircle, Save, Zap } from 'lucide-react'
import { summaryText } from '../data/demoData'

export function StreamingResponse({
  selectedAction,
  streamProgress,
  complete,
}: {
  selectedAction: string
  streamProgress: number
  complete: boolean
}) {
  const visibleLength = Math.ceil((summaryText.length * streamProgress) / 100)
  const visibleText = complete ? summaryText : summaryText.slice(0, visibleLength)

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="mt-6 max-w-[520px] rounded-[22px] border border-[#273041] bg-[#10141C] p-5 text-[#F6F8FB] shadow-[0_24px_70px_rgba(7,10,15,0.22)]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">{selectedAction === 'Summarize' ? 'Summary' : selectedAction}</h3>
        <span className="rounded-full border border-[#63F7D4]/30 bg-[#63F7D4]/10 px-3 py-1 text-xs font-semibold text-[#63F7D4]">
          {complete ? 'Complete' : 'Streaming'}
        </span>
      </div>
      <p className="mt-4 min-h-[112px] text-sm leading-7 text-[#DCE3EE]">
        {visibleText}
        {!complete && <motion.span className="ml-1 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-[#63F7D4]" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#273041] pt-4">
        <p className="text-xs font-medium text-[#697386]">Smart Mode · Claude · Cost $0.0012</p>
        <div className="flex flex-wrap gap-2">
          <ResponseAction icon={Copy} label="Copy" />
          <ResponseAction icon={Save} label="Save" />
          <ResponseAction icon={MessageCircle} label="Ask follow-up" />
          <ResponseAction icon={Zap} label="Try Efficient" />
        </div>
      </div>
    </motion.section>
  )
}

function ResponseAction({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-[#273041] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[#A7B0C0] transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
