import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Globe2, Lock, MoreHorizontal, Puzzle, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react'
import type { DemoPhase } from '../state/demoStore'
import { ArticlePage } from './ArticlePage'
import { ExtensionPopup } from './ExtensionPopup'
import { QuickActionPanel } from './QuickActionPanel'
import type { QuickAction } from '../data/demoData'

export function BrowserFrame({
  phase,
  selectedAction,
  routingStep,
  streamProgress,
  popupOpen,
  walletBalance,
  dailySpend,
  onHighlight,
  onAsk,
  onSelectAction,
  onRun,
  onClosePanel,
  onOpenPopup,
  onClosePopup,
  onReset,
}: {
  phase: DemoPhase
  selectedAction: QuickAction
  routingStep: number
  streamProgress: number
  popupOpen: boolean
  walletBalance: number
  dailySpend: number
  onHighlight: () => void
  onAsk: () => void
  onSelectAction: (action: QuickAction) => void
  onRun: () => void
  onClosePanel: () => void
  onOpenPopup: () => void
  onClosePopup: () => void
  onReset: () => void
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#273041] bg-[#10141C] shadow-[0_34px_120px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="border-b border-[#273041] bg-[#171C26] px-4 py-3">
        <div className="flex items-center gap-3">
          <WindowDots />
          <div className="flex items-center gap-1 text-[#697386]">
            <ChromeIcon icon={ChevronLeft} />
            <ChromeIcon icon={ChevronRight} />
            <ChromeIcon icon={RefreshCw} />
          </div>
          <div className="hidden h-10 flex-1 items-center gap-2 rounded-full border border-[#273041] bg-[#070A0F] px-4 text-sm text-[#A7B0C0] sm:flex">
            <Lock className="h-4 w-4 text-[#3DFF9F]" />
            <span className="truncate">learn.example.com/ai-productivity-education</span>
          </div>
          <button
            onClick={onOpenPopup}
            className="flex h-10 items-center gap-2 rounded-full border border-[#63F7D4]/35 bg-[#63F7D4]/10 px-3 text-sm font-bold text-[#F6F8FB] shadow-[0_0_24px_rgba(99,247,212,0.12)] transition hover:border-[#63F7D4]/60 sm:px-4"
          >
            <Puzzle className="h-4 w-4 text-[#63F7D4]" />
            Ninjai
          </button>
          <ChromeIcon icon={MoreHorizontal} />
        </div>
      </div>

      <div className="grid grid-cols-1 bg-[#F6F8FB] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white px-5 py-7 text-slate-700 lg:block">
          <div className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-950">
            <Globe2 className="h-4 w-4" />
            Learn Daily
          </div>
          <nav className="space-y-2 text-sm">
            {['Research', 'Classroom AI', 'Study methods', 'Reports'].map((item, index) => (
              <div key={item} className={`rounded-2xl px-3 py-2 ${index === 1 ? 'bg-slate-100 font-semibold text-slate-950' : 'text-slate-500'}`}>
                {item}
              </div>
            ))}
          </nav>
          <div className="mt-10 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <ShieldCheck className="h-5 w-5 text-[#0E9F79]" />
            <p className="mt-3 text-sm leading-6 text-slate-600">Ninjai works over normal pages without changing the article.</p>
          </div>
        </aside>

        <div className="relative">
          <ArticlePage
            phase={phase}
            routingStep={routingStep}
            streamProgress={streamProgress}
            selectedAction={selectedAction}
            onHighlight={onHighlight}
            onAsk={onAsk}
          />

          <AnimatePresence>
            {phase === 'panel' && (
              <QuickActionPanel
                selectedAction={selectedAction}
                onSelect={onSelectAction}
                onRun={onRun}
                onClose={onClosePanel}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <ExtensionPopup open={popupOpen} balance={walletBalance} dailySpend={dailySpend} onClose={onClosePopup} />

      <button
        onClick={onReset}
        className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full border border-[#273041] bg-[#10141C]/92 px-4 py-2 text-xs font-bold text-[#A7B0C0] shadow-xl backdrop-blur-xl transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset demo
      </button>
    </section>
  )
}

function WindowDots() {
  return (
    <div className="flex gap-2">
      <div className="h-3 w-3 rounded-full bg-[#FF6B5F]" />
      <div className="h-3 w-3 rounded-full bg-[#FFB84D]" />
      <div className="h-3 w-3 rounded-full bg-[#3DFF9F]" />
    </div>
  )
}

function ChromeIcon({ icon: Icon }: { icon: typeof ChevronLeft }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/7">
      <Icon className="h-4 w-4" />
    </button>
  )
}
