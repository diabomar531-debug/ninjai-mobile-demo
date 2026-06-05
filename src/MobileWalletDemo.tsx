import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Gauge,
  Home,
  MessageSquareText,
  Plus,
  Route,
  Send,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type Tab = 'home' | 'ask' | 'activity' | 'settings'
type RoutingMode = 'Smart' | 'Instant' | 'Deep' | 'Efficient'
type LoadingStep = 'idle' | 'routing' | 'responding' | 'complete'

type Transaction = {
  id: number
  title: string
  detail: string
  cost: number
  time: string
}

const promptCost = 0.03

const routingModes: Array<{ mode: RoutingMode; label: string; provider: string; icon: LucideIcon }> = [
  { mode: 'Smart', label: 'Balanced', provider: 'GPT-4o mini', icon: Brain },
  { mode: 'Instant', label: 'Fastest', provider: 'Gemini Flash', icon: Zap },
  { mode: 'Deep', label: 'Best quality', provider: 'Claude Haiku', icon: Route },
  { mode: 'Efficient', label: 'Lowest cost', provider: 'Gemini Flash', icon: Gauge },
]

const quickPrompts = {
  Summarize: 'Summarize this article into three useful takeaways.',
  Explain: 'Explain this concept in plain English with one example.',
  Rewrite: 'Rewrite this message so it sounds clearer and more confident.',
  'Study help': 'Help me study this topic and quiz me on the key ideas.',
}

const initialTransactions: Transaction[] = [
  { id: 1, title: 'Summary', detail: 'Claude - Smart Mode', cost: 0.0012, time: 'Yesterday' },
  { id: 2, title: 'Rewrite', detail: 'GPT - Efficient Mode', cost: 0.0021, time: 'Mon' },
]

function MobileWalletDemo() {
  const reduceMotion = useReducedMotion()
  const [tab, setTab] = useState<Tab>('ask')
  const [balance, setBalance] = useState(10)
  const [todaySpend, setTodaySpend] = useState(0)
  const [mode, setMode] = useState<RoutingMode>('Smart')
  const [prompt, setPrompt] = useState('')
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('idle')
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [toast, setToast] = useState('')

  const modeMeta = routingModes.find((item) => item.mode === mode) ?? routingModes[0]
  const insufficientBalance = balance < promptCost
  const canSubmit = prompt.trim().length > 0 && !insufficientBalance && loadingStep !== 'routing' && loadingStep !== 'responding'

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const submitPrompt = () => {
    if (!canSubmit) {
      return
    }

    setLoadingStep('routing')
    window.setTimeout(() => setLoadingStep('responding'), 850)
    window.setTimeout(() => {
      setBalance((value) => Number((value - promptCost).toFixed(2)))
      setTodaySpend((value) => Number((value + promptCost).toFixed(2)))
      setTransactions((items) => [
        { id: Date.now(), title: 'AI Prompt', detail: `${mode} Mode`, cost: promptCost, time: 'Just now' },
        ...items,
      ])
      setLoadingStep('complete')
      setToast('Charged $0.03 - Balance updated')
    }, 1750)
  }

  const topUpWallet = (amount = 5) => {
    setBalance((value) => Number((value + amount).toFixed(2)))
    setToast(`Wallet topped up - $${amount} added`)
    setTab('ask')
  }

  return (
    <main className="min-h-screen bg-[#070A0F] px-4 py-6 text-[#F6F8FB] antialiased">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(99,247,212,0.16),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(79,124,255,0.11),transparent_26%),linear-gradient(180deg,#070A0F,#090D14)]" />
      <div className="fixed inset-0 opacity-[0.055] bg-[linear-gradient(rgba(255,255,255,0.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.75)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative mx-auto flex min-h-[844px] w-full max-w-[390px] flex-col overflow-hidden rounded-[34px] border border-[#273041] bg-[#070A0F] shadow-[0_34px_120px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(99,247,212,0.14),transparent_30%)]" />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <AppHeader />
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-24">
            <AnimatePresence mode="wait">
              {tab === 'home' && <HomeScreen key="home" balance={balance} todaySpend={todaySpend} mode={mode} onTopUp={topUpWallet} onAsk={() => setTab('ask')} />}
              {tab === 'ask' && (
                <AskScreen
                  key="ask"
                  balance={balance}
                  todaySpend={todaySpend}
                  mode={mode}
                  setMode={setMode}
                  prompt={prompt}
                  setPrompt={setPrompt}
                  loadingStep={loadingStep}
                  modeMeta={modeMeta}
                  insufficientBalance={insufficientBalance}
                  canSubmit={canSubmit}
                  onSubmit={submitPrompt}
                  onTopUp={() => topUpWallet(5)}
                />
              )}
              {tab === 'activity' && <ActivityScreen key="activity" balance={balance} todaySpend={todaySpend} mode={mode} transactions={transactions} />}
              {tab === 'settings' && <SettingsScreen key="settings" mode={mode} setMode={setMode} onLowBalance={() => setBalance(0.02)} onReset={() => {
                setBalance(10)
                setTodaySpend(0)
                setTransactions(initialTransactions)
                setLoadingStep('idle')
                setPrompt('')
                setToast('Demo reset')
              }} />}
            </AnimatePresence>
          </div>

          <BottomNav active={tab} onChange={setTab} />
        </div>
        <Toast message={toast} reduceMotion={reduceMotion} />
      </section>
    </main>
  )
}

function AppHeader() {
  return (
    <header className="relative flex items-center justify-between px-4 pb-3 pt-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#63F7D4] text-[#06100D] shadow-[0_18px_44px_rgba(99,247,212,0.2)]">
          <Route className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none">Ninjai</p>
          <p className="mt-1 text-xs font-medium text-[#697386]">One Wallet. Any AI. Anywhere.</p>
        </div>
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#273041] bg-[#10141C] text-[#A7B0C0]">
        <Sparkles className="h-4 w-4 text-[#63F7D4]" />
      </button>
    </header>
  )
}

function HomeScreen({
  balance,
  todaySpend,
  mode,
  onTopUp,
  onAsk,
}: {
  balance: number
  todaySpend: number
  mode: RoutingMode
  onTopUp: (amount?: number) => void
  onAsk: () => void
}) {
  return (
    <Screen>
      <WalletBalanceCard balance={balance} todaySpend={todaySpend} mode={mode} />
      <section className="mt-4 rounded-[24px] border border-[#273041] bg-[#10141C] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">Universal AI wallet</p>
        <h1 className="mt-3 text-2xl font-bold">Fund once. Ask anywhere.</h1>
        <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">
          Ninjai routes each prompt to a suitable AI provider and charges only for completed tasks.
        </p>
        <button onClick={onAsk} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-[#63F7D4] text-sm font-bold text-[#06100D]">
          Ask Ninjai
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
      <section className="mt-4 grid grid-cols-3 gap-2">
        {[5, 10, 20].map((amount) => (
          <button key={amount} onClick={() => onTopUp(amount)} className="rounded-[20px] border border-[#273041] bg-white/[0.035] p-4 text-left transition hover:border-[#63F7D4]/45">
            <Plus className="h-4 w-4 text-[#63F7D4]" />
            <p className="mt-3 text-sm font-bold">${amount}</p>
            <p className="mt-1 text-[11px] text-[#697386]">Top up</p>
          </button>
        ))}
      </section>
    </Screen>
  )
}

function AskScreen({
  balance,
  todaySpend,
  mode,
  setMode,
  prompt,
  setPrompt,
  loadingStep,
  modeMeta,
  insufficientBalance,
  canSubmit,
  onSubmit,
  onTopUp,
}: {
  balance: number
  todaySpend: number
  mode: RoutingMode
  setMode: (mode: RoutingMode) => void
  prompt: string
  setPrompt: (prompt: string) => void
  loadingStep: LoadingStep
  modeMeta: { mode: RoutingMode; label: string; provider: string; icon: LucideIcon }
  insufficientBalance: boolean
  canSubmit: boolean
  onSubmit: () => void
  onTopUp: () => void
}) {
  return (
    <Screen>
      <WalletBalanceCard balance={balance} todaySpend={todaySpend} mode={mode} availableBalance={balance} />
      <PromptInput prompt={prompt} setPrompt={setPrompt} canSubmit={canSubmit} loadingStep={loadingStep} onSubmit={onSubmit} />
      <RoutingModeSelector mode={mode} setMode={setMode} />

      {insufficientBalance && <InsufficientBalanceNotice onTopUp={onTopUp} />}

      <AnimatePresence mode="wait">
        {loadingStep === 'idle' && !prompt && <EmptyState key="empty" />}
        {(loadingStep === 'routing' || loadingStep === 'responding') && <LoadingState key="loading" step={loadingStep} />}
        {loadingStep === 'complete' && <AIResponseCard key="response" mode={mode} provider={modeMeta.provider} cost={promptCost} />}
      </AnimatePresence>
    </Screen>
  )
}

function WalletBalanceCard({
  balance,
  todaySpend,
  mode,
  availableBalance,
}: {
  balance: number
  todaySpend: number
  mode: RoutingMode
  availableBalance?: number
}) {
  return (
    <section className="rounded-[24px] border border-[#63F7D4]/25 bg-[#10141C] p-4 shadow-[0_24px_70px_rgba(99,247,212,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#697386]">Wallet balance</p>
          <motion.p key={balance} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[34px] font-bold leading-none">
            ${balance.toFixed(2)}
          </motion.p>
        </div>
        <div className="rounded-full border border-[#63F7D4]/30 bg-[#63F7D4]/10 px-3 py-1.5 text-xs font-bold text-[#63F7D4]">{mode}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniMetric label="Available" value={`$${(availableBalance ?? balance).toFixed(2)}`} />
        <MiniMetric label="Today spent" value={`$${todaySpend.toFixed(2)}`} />
      </div>
      <p className="mt-4 rounded-[18px] border border-[#273041] bg-white/[0.035] p-3 text-xs leading-5 text-[#A7B0C0]">
        PAYG wallet active. Ninjai routes prompts across providers and records every charge.
      </p>
    </section>
  )
}

function PromptInput({
  prompt,
  setPrompt,
  canSubmit,
  loadingStep,
  onSubmit,
}: {
  prompt: string
  setPrompt: (prompt: string) => void
  canSubmit: boolean
  loadingStep: LoadingStep
  onSubmit: () => void
}) {
  return (
    <section className="mt-4 rounded-[24px] border border-[#273041] bg-[#10141C] p-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(quickPrompts).map(([label, value]) => (
          <button key={label} onClick={() => setPrompt(value)} className="rounded-full border border-[#273041] bg-white/[0.035] px-3 py-1.5 text-xs font-bold text-[#A7B0C0] transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]">
            {label}
          </button>
        ))}
      </div>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ask anything..."
        className="mt-4 min-h-28 w-full resize-none rounded-[20px] border border-[#273041] bg-[#070A0F] p-4 text-sm leading-6 text-[#F6F8FB] outline-none placeholder:text-[#697386] focus:border-[#63F7D4]/50"
      />
      <button
        disabled={!canSubmit}
        onClick={onSubmit}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-[#63F7D4] text-sm font-bold text-[#06100D] shadow-[0_18px_44px_rgba(99,247,212,0.18)] transition hover:bg-[#7EF9DD] disabled:cursor-not-allowed disabled:bg-[#273041] disabled:text-[#697386]"
      >
        {loadingStep === 'routing' || loadingStep === 'responding' ? 'Working...' : 'Ask Ninjai'}
        <Send className="h-4 w-4" />
      </button>
    </section>
  )
}

function RoutingModeSelector({ mode, setMode }: { mode: RoutingMode; setMode: (mode: RoutingMode) => void }) {
  return (
    <section className="mt-4 rounded-[24px] border border-[#273041] bg-[#10141C] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold">Routing mode</p>
        <p className="text-xs font-medium text-[#697386]">Default: Smart</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {routingModes.map((item) => {
          const Icon = item.icon
          const active = mode === item.mode
          return (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`rounded-[18px] border p-3 text-left transition ${active ? 'border-[#63F7D4]/55 bg-[#63F7D4]/12' : 'border-[#273041] bg-white/[0.035] hover:border-[#63F7D4]/35'}`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-[#63F7D4]' : 'text-[#A7B0C0]'}`} />
              <p className="mt-3 text-sm font-bold">{item.mode}</p>
              <p className="mt-1 text-xs text-[#697386]">{item.label}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AIResponseCard({ mode, provider, cost }: { mode: RoutingMode; provider: string; cost: number }) {
  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-[24px] border border-[#273041] bg-[#10141C] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">Ninjai response</p>
          <h2 className="mt-2 text-lg font-bold">Routed answer</h2>
        </div>
        <span className="rounded-full border border-[#3DFF9F]/30 bg-[#3DFF9F]/10 px-3 py-1.5 text-xs font-bold text-[#3DFF9F]">Completed</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniMetric label="Provider used" value={provider} />
        <MiniMetric label="Mode used" value={`${mode} Mode`} />
        <MiniMetric label="Estimated cost" value="$0.028" />
        <MiniMetric label="User charge" value={`$${cost.toFixed(2)}`} />
      </div>
      <p className="mt-4 rounded-[20px] border border-[#273041] bg-[#171C26] p-4 text-sm leading-7 text-[#DCE3EE]">
        Ninjai routed this request through {provider} because it matched your {mode.toLowerCase()} preference. Here is a concise answer: focus on the core idea, remove unnecessary context, and turn the result into one clear next action.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-[#63F7D4]/25 bg-[#63F7D4]/10 p-3 text-sm font-bold text-[#63F7D4]">
        <CheckCircle2 className="h-4 w-4" />
        Charged $0.03 - Balance updated
      </div>
    </motion.section>
  )
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <section className="mt-4 rounded-[24px] border border-[#273041] bg-[#10141C] p-4">
      <p className="mb-3 text-sm font-bold">Transactions</p>
      <div className="space-y-2">
        {transactions.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-[18px] border border-[#273041] bg-white/[0.035] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#63F7D4]/10 text-[#63F7D4]">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">{item.title}</p>
                <p className="mt-1 text-xs text-[#697386]">{item.detail} - {item.time}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-[#A7B0C0]">-${item.cost.toFixed(item.cost >= 0.01 ? 2 : 4)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function InsufficientBalanceNotice({ onTopUp }: { onTopUp: () => void }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-[24px] border border-[#FFB84D]/30 bg-[#FFB84D]/10 p-4">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#FFB84D]" />
        <div>
          <h3 className="font-bold text-[#F6F8FB]">Insufficient balance.</h3>
          <p className="mt-1 text-sm leading-6 text-[#A7B0C0]">Top up to continue asking AI through your Ninjai wallet.</p>
          <button onClick={onTopUp} className="mt-3 rounded-full bg-[#63F7D4] px-4 py-2 text-sm font-bold text-[#06100D]">Top up wallet</button>
        </div>
      </div>
    </motion.section>
  )
}

function LoadingState({ step }: { step: LoadingStep }) {
  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-[24px] border border-[#4F7CFF]/25 bg-[#4F7CFF]/10 p-4">
      <div className="space-y-3">
        <LoadingRow label="Routing request..." active done={step === 'responding'} />
        <LoadingRow label="Provider responding..." active={step === 'responding'} done={false} />
      </div>
      <p className="mt-4 text-sm leading-6 text-[#A7B0C0]">Ninjai is selecting a provider and preparing task-level billing before charging your wallet.</p>
    </motion.section>
  )
}

function LoadingRow({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-[18px] border p-3 ${active ? 'border-[#63F7D4]/30 bg-[#63F7D4]/10' : 'border-[#273041] bg-white/[0.03]'}`}>
      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? 'bg-[#63F7D4] text-[#06100D]' : 'bg-white/8 text-[#63F7D4]'}`}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : <motion.span className="h-2 w-2 rounded-full bg-[#63F7D4]" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 0.9, repeat: Infinity }} />}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-[24px] border border-[#273041] bg-[#10141C] p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#63F7D4]/10 text-[#63F7D4]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-bold">Your AI wallet is ready.</h2>
      <p className="mt-2 text-sm leading-6 text-[#A7B0C0]">
        Ask anything and Ninjai will route it to the best available AI provider.
      </p>
    </motion.section>
  )
}

function ActivityScreen({
  balance,
  todaySpend,
  mode,
  transactions,
}: {
  balance: number
  todaySpend: number
  mode: RoutingMode
  transactions: Transaction[]
}) {
  return (
    <Screen>
      <WalletBalanceCard balance={balance} todaySpend={todaySpend} mode={mode} />
      <TransactionList transactions={transactions} />
    </Screen>
  )
}

function SettingsScreen({
  mode,
  setMode,
  onLowBalance,
  onReset,
}: {
  mode: RoutingMode
  setMode: (mode: RoutingMode) => void
  onLowBalance: () => void
  onReset: () => void
}) {
  return (
    <Screen>
      <section className="rounded-[24px] border border-[#273041] bg-[#10141C] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">Settings</p>
        <h1 className="mt-3 text-2xl font-bold">Wallet routing controls</h1>
        <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">Set the default mode and preview wallet states for the deterministic demo.</p>
      </section>
      <RoutingModeSelector mode={mode} setMode={setMode} />
      <section className="mt-4 grid gap-2">
        <button onClick={onLowBalance} className="h-12 rounded-[18px] border border-[#FFB84D]/35 bg-[#FFB84D]/10 text-sm font-bold text-[#FFB84D]">Preview insufficient balance</button>
        <button onClick={onReset} className="h-12 rounded-[18px] border border-[#273041] bg-[#10141C] text-sm font-bold text-[#F6F8FB]">Reset demo state</button>
      </section>
    </Screen>
  )
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ tab: Tab; label: string; icon: LucideIcon }> = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'ask', label: 'Ask', icon: MessageSquareText },
    { tab: 'activity', label: 'Activity', icon: Activity },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="absolute inset-x-3 bottom-3 rounded-[26px] border border-[#273041] bg-[#10141C]/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const selected = active === item.tab
          return (
            <button key={item.tab} onClick={() => onChange(item.tab)} className={`flex h-14 flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] font-bold transition ${selected ? 'bg-[#63F7D4] text-[#06100D]' : 'text-[#697386] hover:bg-white/[0.04] hover:text-[#F6F8FB]'}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="pb-4">
      {children}
    </motion.div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#273041] bg-white/[0.035] p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#697386]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#F6F8FB]">{value}</p>
    </div>
  )
}

function Toast({ message, reduceMotion }: { message: string; reduceMotion: boolean | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-24 left-4 right-4 z-50 flex items-center gap-3 rounded-full border border-[#63F7D4]/30 bg-[#10141C]/95 px-4 py-3 text-sm font-bold text-[#F6F8FB] shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <CheckCircle2 className="h-5 w-5 text-[#3DFF9F]" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileWalletDemo
