import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Clock3, CreditCard, LayoutDashboard, Settings, Sparkles, Wallet, X } from 'lucide-react'
import { demoInitialState, recentActivity } from '../data/demoData'
import { BalanceDisplay } from './BalanceDisplay'

export function ExtensionPopup({
  open,
  balance,
  dailySpend,
  onClose,
}: {
  open: boolean
  balance: number
  dailySpend: number
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black/35"
          onClick={onClose}
        >
          <motion.aside
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onClick={(event) => event.stopPropagation()}
            className="absolute left-3 right-3 top-14 h-[520px] rounded-[28px] border border-[#273041] bg-[#10141C] p-5 text-[#F6F8FB] shadow-[0_30px_100px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.08)] sm:left-auto sm:right-7 sm:w-[360px]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#63F7D4] text-[#06100D]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Ninjai</h2>
                  <p className="text-xs font-medium text-[#697386]">Ambient AI wallet</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full border border-[#273041] p-2 text-[#A7B0C0] transition hover:text-[#F6F8FB]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-[22px] border border-[#273041] bg-[#171C26] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#697386]">AI Wallet Balance</p>
              <div className="mt-2">
                <BalanceDisplay value={balance} />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                <motion.div className="h-full w-[0.024%] rounded-full bg-[#63F7D4]" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-medium text-[#A7B0C0]">
                <span>Today: ${dailySpend.toFixed(4)} / ${demoInitialState.dailyLimit.toFixed(2)}</span>
                <span>Mode: Smart</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#697386]">Quick Actions</p>
              <div className="grid grid-cols-3 gap-2">
                {['Summarize Page', 'Ask About Page', 'Rewrite Selected Text'].map((label) => (
                  <button key={label} className="min-h-16 rounded-[16px] border border-[#273041] bg-white/[0.035] px-2 py-3 text-xs font-semibold text-[#DCE3EE] transition hover:border-[#63F7D4]/45">
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#697386]">Recent Activity</p>
              <div className="space-y-2">
                {recentActivity.slice(0, 2).map((item) => (
                  <div key={`${item.task}-${item.time}`} className="flex items-center justify-between rounded-[16px] border border-[#273041] bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#63F7D4]" />
                      <span className="text-sm font-medium">{item.task} · {item.provider}</span>
                    </div>
                    <span className="text-xs text-[#A7B0C0]">${item.cost.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-[#8A6CFF]/25 bg-[#8A6CFF]/10 p-3">
              <div className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C9BDFF]" />
                <p className="text-sm leading-5 text-[#DCE3EE]">Efficient mode could save ~32% on summaries.</p>
              </div>
            </div>

            <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2">
              <PopupFooter icon={CreditCard} label="Top Up" />
              <PopupFooter icon={LayoutDashboard} label="Dashboard" />
              <PopupFooter icon={Settings} label="Settings" />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PopupFooter({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#273041] bg-white/[0.04] text-xs font-bold text-[#A7B0C0] transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
