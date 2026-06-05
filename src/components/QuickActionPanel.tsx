import { motion } from 'framer-motion'
import { BookOpen, Brain, Languages, MessageSquareText, PenLine, Sparkles, X } from 'lucide-react'
import { demoInitialState, quickActions, type QuickAction } from '../data/demoData'
import { ActionButton } from './ActionButton'
import { BalanceDisplay } from './BalanceDisplay'

const icons = {
  Summarize: Sparkles,
  Explain: BookOpen,
  Rewrite: PenLine,
  Translate: Languages,
  'Quiz Me': Brain,
  'Ask Anything': MessageSquareText,
} satisfies Record<QuickAction, typeof Sparkles>

export function QuickActionPanel({
  selectedAction,
  onSelect,
  onRun,
  onClose,
}: {
  selectedAction: QuickAction
  onSelect: (action: QuickAction) => void
  onRun: () => void
  onClose: () => void
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-4 right-4 top-[214px] z-40 rounded-[24px] border border-[#273041] bg-[#10141C]/95 p-4 text-[#F6F8FB] shadow-[0_28px_90px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:left-auto sm:right-8 sm:top-[236px] sm:w-[340px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#63F7D4]">Selected text</p>
          <h2 className="mt-2 text-lg font-bold">Ask Ninjai</h2>
        </div>
        <button onClick={onClose} className="rounded-full border border-[#273041] p-2 text-[#A7B0C0] transition hover:text-[#F6F8FB]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {quickActions.map((action) => (
          <ActionButton key={action} icon={icons[action]} label={action} active={selectedAction === action} onClick={() => onSelect(action)} />
        ))}
      </div>

      <div className="mt-4 rounded-[18px] border border-[#273041] bg-[#171C26] p-3">
        <div className="grid grid-cols-3 gap-3">
          <PanelMetric label="Mode" value={demoInitialState.mode} />
          <PanelMetric label="Estimated" value="~$0.001" />
          <div>
            <p className="text-xs font-medium text-[#697386]">Wallet</p>
            <BalanceDisplay value={demoInitialState.walletBalance} compact />
          </div>
        </div>
      </div>

      <button
        onClick={onRun}
        className="mt-4 h-12 w-full rounded-[18px] bg-[#63F7D4] text-sm font-bold text-[#06100D] shadow-[0_16px_36px_rgba(99,247,212,0.18),inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:bg-[#7EF9DD] active:scale-[0.99]"
      >
        Run with Ninjai
      </button>
    </motion.aside>
  )
}

function PanelMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#697386]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#F6F8FB]">{value}</p>
    </div>
  )
}
