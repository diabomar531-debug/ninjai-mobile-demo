import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, WalletCards } from 'lucide-react'
import { BrowserFrame } from './components/BrowserFrame'
import { InsightCard } from './components/InsightCard'
import { WalletToast } from './components/WalletToast'
import { demoInitialState } from './data/demoData'
import { useDemoStore } from './state/demoStore'

function ExtensionDemo() {
  const demo = useDemoStore()
  const hasRunTask = demo.phase === 'complete'

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A0F] px-4 py-6 text-[#F6F8FB] antialiased sm:px-6 lg:px-8">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,247,212,0.16),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(79,124,255,0.12),transparent_26%),linear-gradient(180deg,#070A0F,#090D14)]" />
      <div className="fixed inset-0 opacity-[0.055] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#63F7D4]/25 bg-[#63F7D4]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">
              <Sparkles className="h-3.5 w-3.5" />
              Browser extension prototype
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              AI anywhere in the browser, powered by one PAYG wallet.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#A7B0C0]">
              Highlight anything, ask Ninjai, get the best AI response, and pay only for the task.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={demo.highlightText}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#63F7D4] px-5 text-sm font-bold text-[#06100D] shadow-[0_16px_36px_rgba(99,247,212,0.18)] transition hover:bg-[#7EF9DD] active:scale-[0.99]"
            >
              Start Demo
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={demo.openPopup}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#273041] bg-[#10141C] px-5 text-sm font-bold text-[#F6F8FB] transition hover:border-[#63F7D4]/45"
            >
              <WalletCards className="h-4 w-4 text-[#63F7D4]" />
              Open Extension Popup
            </button>
          </div>
        </header>

        <BrowserFrame
          phase={demo.phase}
          selectedAction={demo.selectedAction}
          routingStep={demo.routingStep}
          streamProgress={demo.streamProgress}
          popupOpen={demo.popupOpen}
          walletBalance={demo.walletBalance}
          dailySpend={demo.dailySpend}
          onHighlight={demo.highlightText}
          onAsk={demo.openPanel}
          onSelectAction={demo.chooseAction}
          onRun={demo.runTask}
          onClosePanel={demo.closePanel}
          onOpenPopup={demo.openPopup}
          onClosePopup={demo.closePopup}
          onReset={demo.resetDemo}
        />

        {hasRunTask && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
            <InsightCard efficient={demo.tryEfficient} onTryEfficient={demo.tryEfficientNext} />
            <div className="rounded-[24px] border border-[#273041] bg-[#10141C] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#697386]">Wallet trust</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm text-[#A7B0C0]">$10.00 to</p>
                  <p className="text-2xl font-bold text-[#F6F8FB]">${demo.walletBalance.toFixed(4)}</p>
                </div>
                <p className="text-right text-sm leading-6 text-[#A7B0C0]">
                  Today: ${demo.dailySpend.toFixed(4)} / ${demoInitialState.dailyLimit.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <WalletToast visible={demo.toastVisible} />
    </main>
  )
}

export default ExtensionDemo
