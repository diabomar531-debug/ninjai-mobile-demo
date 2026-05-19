import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Gauge,
  Home,
  Languages,
  Layers3,
  LineChart,
  LockKeyhole,
  MessageCircle,
  Minus,
  PenLine,
  Route,
  ShieldCheck,
  Sparkles,
  Wallet,
  Wand2,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

type Step =
  | 'welcome'
  | 'mode'
  | 'comfort'
  | 'funds'
  | 'home'
  | 'routing'
  | 'streaming'
  | 'wallet'
  | 'insights'
  | 'vision'

type AiMode = 'Instant' | 'Smart' | 'Deep' | 'Efficient'
type Comfort = '$1' | '$2' | '$5' | 'Custom'

const taskCost = 0.0012
const onboardingSteps: Step[] = ['welcome', 'mode', 'comfort', 'funds']
const savingsBars = ['h-[42%]', 'h-[58%]', 'h-[36%]', 'h-[66%]', 'h-[48%]', 'h-[78%]', 'h-[60%]']

const modeOptions: Array<{
  name: AiMode
  icon: LucideIcon
  copy: string
  detail: string
}> = [
  { name: 'Instant', icon: Zap, copy: 'Fast answers for simple tasks.', detail: 'Prioritizes speed' },
  { name: 'Smart', icon: Brain, copy: 'Balanced quality and price.', detail: 'Best everyday route' },
  { name: 'Deep', icon: Layers3, copy: 'More reasoning for harder asks.', detail: 'Highest capability' },
  { name: 'Efficient', icon: Gauge, copy: 'Minimize cost for routine work.', detail: 'Lowest spend' },
]

const quickActions: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Summarize', icon: Sparkles },
  { label: 'Rewrite', icon: PenLine },
  { label: 'Explain', icon: MessageCircle },
  { label: 'Translate', icon: Languages },
  { label: 'Improve', icon: Wand2 },
  { label: 'Ask', icon: Brain },
]

function App() {
  const [step, setStep] = useState<Step>('welcome')
  const [selectedMode, setSelectedMode] = useState<AiMode>('Smart')
  const [comfort, setComfort] = useState<Comfort>('$2')
  const [funds, setFunds] = useState(10)
  const [balance, setBalance] = useState(10)
  const [sheetOpen, setSheetOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const dailySpend = ['wallet', 'insights', 'vision'].includes(step) ? taskCost : 0

  const startTask = () => {
    setSheetOpen(false)
    setStep('routing')
  }

  const completeTask = () => {
    setBalance(Number((funds - taskCost).toFixed(4)))
    setStep('wallet')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A0F] text-white antialiased">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,247,212,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_34%,rgba(99,247,212,0.04))]" />
      <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-6">
        <div className="relative h-[844px] w-[390px] max-h-[calc(100vh-24px)] max-w-[calc(100vw-24px)] overflow-hidden rounded-[42px] border border-white/14 bg-[#070A0F] shadow-[0_34px_120px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,255,255,0.12)]">
          <div className="pointer-events-none absolute inset-0 rounded-[42px] ring-1 ring-inset ring-white/8" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#63F7D4]/65 to-transparent" />
          <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[#070A0F] via-[#070A0F]/88 to-transparent px-6 pt-3">
            <StatusBar />
            <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-white/18 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,247,212,0.12),transparent_26%),radial-gradient(circle_at_90%_28%,rgba(118,119,255,0.12),transparent_24%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_22%,rgba(255,255,255,0.018)_72%,transparent)]" />
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="relative flex h-full flex-col px-5 pb-5 pt-16">
            {onboardingSteps.includes(step) && <ProgressDots step={step} />}
            <AnimatePresence mode="wait">
              <ScreenShell key={step} reduceMotion={reduceMotion}>
                {step === 'welcome' && <Welcome onNext={() => setStep('mode')} />}
                {step === 'mode' && (
                  <ModeScreen selectedMode={selectedMode} setSelectedMode={setSelectedMode} onNext={() => setStep('comfort')} />
                )}
                {step === 'comfort' && (
                  <ComfortScreen comfort={comfort} setComfort={setComfort} onNext={() => setStep('funds')} />
                )}
                {step === 'funds' && (
                  <FundsScreen
                    funds={funds}
                    setFunds={(value) => {
                      setFunds(value)
                      setBalance(value)
                    }}
                    onNext={() => setStep('home')}
                  />
                )}
                {step === 'home' && (
                  <HomeScreen
                    balance={balance}
                    dailySpend={dailySpend}
                    selectedMode={selectedMode}
                    comfort={comfort}
                    onAsk={() => setSheetOpen(true)}
                  />
                )}
                {step === 'routing' && <RoutingScreen onNext={() => setStep('streaming')} />}
                {step === 'streaming' && <StreamingScreen onNext={completeTask} />}
                {step === 'wallet' && <WalletUpdate balance={balance} onNext={() => setStep('insights')} />}
                {step === 'insights' && <InsightsScreen onNext={() => setStep('vision')} />}
                {step === 'vision' && <VisionScreen onRestart={() => setStep('home')} />}
              </ScreenShell>
            </AnimatePresence>
            {isTabbed(step) && (
              <BottomNav
                active={step}
                goHome={() => setStep('home')}
                goInsights={() => setStep('insights')}
                goWallet={() => setStep('wallet')}
              />
            )}
          </div>
          <AnimatePresence>{sheetOpen && <AskSheet onClose={() => setSheetOpen(false)} onStart={startTask} />}</AnimatePresence>
        </div>
      </div>
    </main>
  )
}

function ScreenShell({ children, reduceMotion }: { children: ReactNode; reduceMotion: boolean | null }) {
  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <TopBrand />
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[24px] border border-[#63F7D4]/25 bg-[#63F7D4]/10 shadow-[0_0_42px_rgba(99,247,212,0.15),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <Route className="h-8 w-8 text-[#63F7D4]" />
        </div>
        <p className="mb-4 text-sm font-medium text-[#63F7D4]">Universal AI wallet</p>
        <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal text-white">One balance for every AI.</h1>
        <p className="mt-5 text-base leading-7 text-white/62">
          Ninjai routes each task to the right model, keeps spending pay-as-you-go, and shows every cent before it moves.
        </p>
      </div>
      <div className="space-y-3">
        <TrustRow icon={ShieldCheck} text="Funds stay in your wallet until a task runs." />
        <PrimaryButton onClick={onNext}>Start demo</PrimaryButton>
      </div>
    </div>
  )
}

function ModeScreen({
  selectedMode,
  setSelectedMode,
  onNext,
}: {
  selectedMode: AiMode
  setSelectedMode: (mode: AiMode) => void
  onNext: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Choose AI mode" copy="Set your default routing style. You can change it any time before asking." />
      <div className="mt-5 grid gap-3">
        {modeOptions.map((mode) => {
          const Icon = mode.icon
          const active = selectedMode === mode.name
          return (
            <button
              key={mode.name}
              onClick={() => setSelectedMode(mode.name)}
              className={`rounded-[24px] border p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition ${
                active ? 'border-[#63F7D4]/60 bg-[#63F7D4]/12 shadow-[0_14px_34px_rgba(99,247,212,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]' : 'border-white/10 bg-white/[0.045]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8">
                  <Icon className={active ? 'h-5 w-5 text-[#63F7D4]' : 'h-5 w-5 text-white/72'} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">{mode.name}</h2>
                    <span className="text-xs text-white/48">{mode.detail}</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-white/56">{mode.copy}</p>
                </div>
                {active && <Check className="h-5 w-5 text-[#63F7D4]" />}
              </div>
            </button>
          )
        })}
      </div>
      <FooterNote text="Smart routing compares quality, latency, and cost before your wallet is charged." />
      <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
    </div>
  )
}

function ComfortScreen({
  comfort,
  setComfort,
  onNext,
}: {
  comfort: Comfort
  setComfort: (comfort: Comfort) => void
  onNext: () => void
}) {
  const options: Comfort[] = ['$1', '$2', '$5', 'Custom']
  return (
    <div className="flex h-full flex-col">
      <Header title="Daily comfort zone" copy="Ninjai keeps tasks inside your preferred daily spend range whenever possible." />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setComfort(option)}
            className={`h-28 rounded-[24px] border text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition ${
              comfort === option ? 'border-[#63F7D4]/70 bg-[#63F7D4]/12 shadow-[0_16px_34px_rgba(99,247,212,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]' : 'border-white/10 bg-white/[0.045]'
            }`}
          >
            <div className="text-3xl font-semibold">{option}</div>
            <div className="mt-2 text-xs text-white/48">{option === 'Custom' ? 'Set later' : 'per day'}</div>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <LockKeyhole className="h-5 w-5 text-[#63F7D4]" />
          <p className="text-sm leading-6 text-white/62">Comfort zones are guidance, not subscriptions. You approve top-ups and can pause routing anytime.</p>
        </div>
      </div>
      <div className="flex-1" />
      <PrimaryButton onClick={onNext}>Set comfort zone</PrimaryButton>
    </div>
  )
}

function FundsScreen({ funds, setFunds, onNext }: { funds: number; setFunds: (funds: number) => void; onNext: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Add wallet funds" copy="Start with a small prepaid balance. Ninjai spends only when a routed task completes." />
      <div className="mt-8 space-y-3">
        {[5, 10, 20].map((amount) => (
          <button
            key={amount}
            onClick={() => setFunds(amount)}
            className={`flex w-full items-center justify-between rounded-[24px] border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition ${
              funds === amount ? 'border-[#63F7D4]/70 bg-[#63F7D4]/12 shadow-[0_16px_34px_rgba(99,247,212,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]' : 'border-white/10 bg-white/[0.045]'
            }`}
          >
            <span className="text-3xl font-semibold">${amount}</span>
            <span className="text-sm text-white/52">{amount === 10 ? 'Recommended demo balance' : 'Pay as you go'}</span>
          </button>
        ))}
      </div>
      <FooterNote text="No token bundles, no model credits, no expiry. One wallet covers any supported AI route." />
      <PrimaryButton onClick={onNext}>Add ${funds}.00</PrimaryButton>
    </div>
  )
}

function HomeScreen({
  balance,
  dailySpend,
  selectedMode,
  comfort,
  onAsk,
}: {
  balance: number
  dailySpend: number
  selectedMode: AiMode
  comfort: Comfort
  onAsk: () => void
}) {
  return (
    <div className="flex h-full flex-col pb-20">
      <TopBrand />
      <div className="mt-5 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/52">Wallet balance</span>
          <BadgeCheck className="h-5 w-5 text-[#63F7D4]" />
        </div>
        <div className="mt-3 text-5xl font-semibold tracking-normal">${balance.toFixed(balance % 1 === 0 ? 2 : 4)}</div>
        <p className="mt-3 text-sm leading-6 text-white/58">Protected prepaid balance for every AI task. No surprise monthly bill.</p>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px] text-white/42">
            <span>7-day task activity</span>
            <span>PAYG</span>
          </div>
          <div className="grid h-12 grid-cols-7 items-end gap-1.5 rounded-2xl bg-black/12 px-2 py-2">
            <div className="h-4 rounded-full bg-[#63F7D4]/45" />
            <div className="h-6 rounded-full bg-[#63F7D4]/55" />
            <div className="h-5 rounded-full bg-[#63F7D4]/45" />
            <div className="h-8 rounded-full bg-[#63F7D4]/70" />
            <div className="h-6 rounded-full bg-[#63F7D4]/55" />
            <div className="h-10 rounded-full bg-[#63F7D4]/85" />
            <div className="h-7 rounded-full bg-[#63F7D4]/60" />
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Metric label="Daily spend" value={`$${dailySpend.toFixed(4)}`} icon={LineChart} />
        <Metric label="Mode" value={selectedMode} icon={Brain} />
      </div>
      <div className="mt-3 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-start gap-3">
          <Compass className="mt-0.5 h-5 w-5 text-[#63F7D4]" />
          <p className="text-sm leading-6 text-white/62">
            Your {comfort} comfort zone guides routing. Ninjai can choose faster, deeper, or cheaper models per task.
          </p>
        </div>
      </div>
      <div className="flex-1" />
      <PrimaryButton onClick={onAsk}>Ask Ninjai</PrimaryButton>
    </div>
  )
}

function AskSheet({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-end bg-black/55 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full rounded-t-[24px] border border-white/10 bg-[#0B1018]/98 p-5 shadow-[0_-24px_70px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/18" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Ask Ninjai</h2>
            <p className="mt-2 text-sm leading-6 text-white/56">Pick a task. Smart routing selects the best AI before spending.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/58">Close</button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={onStart}
                className="flex h-24 flex-col items-center justify-center gap-2 rounded-[24px] border border-white/10 bg-white/[0.045] text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-[#63F7D4]/50"
              >
                <Icon className="h-5 w-5 text-[#63F7D4]" />
                {action.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={onStart}
          className="mt-4 flex w-full items-center justify-between rounded-[24px] border border-[#63F7D4]/30 bg-[#63F7D4]/12 p-4 text-left"
        >
          <span>
            <span className="block text-sm font-medium">Try demo prompt</span>
            <span className="mt-1 block text-xs text-white/50">Explain this contract clause in plain English.</span>
          </span>
          <ChevronRight className="h-5 w-5 text-[#63F7D4]" />
        </button>
      </motion.div>
    </motion.div>
  )
}

function RoutingScreen({ onNext }: { onNext: () => void }) {
  const stages = ['Analyzing task', 'Selecting best AI', 'Optimizing cost']
  return (
    <div className="flex h-full flex-col">
      <Header title="Routing request" copy="Ninjai is comparing models for quality, latency, and wallet impact." />
      <div className="mt-9 space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage}
            className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.045] p-4"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.22, duration: 0.4 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#63F7D4]/12">
              <Check className="h-5 w-5 text-[#63F7D4]" />
            </div>
            <div>
              <div className="font-medium">{stage}</div>
              <div className="mt-1 text-xs text-white/48">{index === 2 ? 'Estimated task cost: $0.0012' : 'Complete'}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="mb-3 flex items-center justify-between text-xs text-white/46">
          <span>Route confidence</span>
          <span>94%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <motion.div className="h-full rounded-full bg-[#63F7D4]" initial={{ width: '24%' }} animate={{ width: '94%' }} transition={{ duration: 0.8, ease: 'easeOut' }} />
        </div>
      </div>
      <div className="mt-6 rounded-[24px] border border-[#63F7D4]/20 bg-[#63F7D4]/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="text-sm leading-6 text-white/64">Best route found: Smart Mode via Claude for a short reasoning answer.</p>
      </div>
      <div className="flex-1" />
      <PrimaryButton onClick={onNext}>View response</PrimaryButton>
    </div>
  )
}

function StreamingScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Streaming response" copy="Smart Mode chose Claude for clear reasoning at a low task cost." />
      <div className="mt-5 flex gap-2">
        {['Smart Mode', 'Claude', 'Cost $0.0012'].map((label) => (
          <span key={label} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white/72">{label}</span>
        ))}
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <motion.p className="text-base leading-7 text-white/78" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          Here is the plain-English version: this clause says the provider can change the service terms, but they must notify you before those changes affect your account.
          <motion.span className="ml-1 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-[#63F7D4]" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.1, repeat: Infinity }} />
        </motion.p>
        <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-6 text-white/60">
          Suggested next step: ask Ninjai to rewrite it as a customer-friendly summary before sending it to your team.
        </div>
      </div>
      <div className="mt-5 rounded-[24px] border border-[#63F7D4]/20 bg-[#63F7D4]/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <CircleDollarSign className="h-5 w-5 text-[#63F7D4]" />
          <p className="text-sm text-white/64">Wallet charge occurs after the response completes.</p>
        </div>
      </div>
      <div className="flex-1" />
      <PrimaryButton onClick={onNext}>Complete task</PrimaryButton>
    </div>
  )
}

function WalletUpdate({ balance, onNext }: { balance: number; onNext: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Wallet updated" copy="Ninjai charged only the routed task cost after completion." />
      <div className="mt-9 rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between text-sm text-white/52">
          <span>Before</span>
          <span>$10.00</span>
        </div>
        <div className="my-5 h-px bg-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/52">Task cost</span>
          <span className="flex items-center gap-1 text-xl font-semibold text-[#63F7D4]"><Minus className="h-4 w-4" />$0.0012</span>
        </div>
        <div className="my-5 h-px bg-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/52">New balance</span>
          <span className="text-3xl font-semibold">${balance.toFixed(4)}</span>
        </div>
      </div>
      <FooterNote text="Transparent micropayments make it easy to use premium AI without juggling subscriptions." />
      <PrimaryButton onClick={onNext}>See insights</PrimaryButton>
    </div>
  )
}

function InsightsScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col pb-20">
      <TopBrand />
      <div className="mt-6 rounded-[24px] border border-[#63F7D4]/20 bg-[#63F7D4]/10 p-5 shadow-[0_18px_48px_rgba(99,247,212,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <LineChart className="h-7 w-7 text-[#63F7D4]" />
        <h1 className="mt-5 text-4xl font-semibold leading-tight">Ninjai saved you 27% this week.</h1>
        <p className="mt-3 text-sm leading-6 text-white/62">Compared with sending every task to the most expensive capable model.</p>
        <div className="mt-5 grid h-20 grid-cols-7 items-end gap-1.5">
          {savingsBars.map((heightClass, index) => (
            <div key={`${heightClass}-${index}`} className="flex h-full items-end rounded-full bg-[#63F7D4]/18 p-0.5">
              <motion.div className={`origin-bottom w-full rounded-full bg-[#63F7D4] ${heightClass}`} initial={{ scaleY: 0.18 }} animate={{ scaleY: 1 }} transition={{ delay: index * 0.05, duration: 0.45 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        <Insight label="Fast routes" value="18" copy="Simple work sent to lower-latency AI." />
        <Insight label="Deep routes" value="4" copy="Complex asks upgraded automatically." />
        <Insight label="Avg cost" value="$0.0021" copy="Across all completed tasks." />
      </div>
      <div className="flex-1" />
      <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
    </div>
  )
}

function VisionScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#63F7D4]/30 bg-[#63F7D4]/12 shadow-[0_0_70px_rgba(99,247,212,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <Wallet className="h-9 w-9 text-[#63F7D4]" />
        </div>
        <p className="mb-4 text-sm font-medium text-[#63F7D4]">Ninjai</p>
        <h1 className="text-5xl font-semibold leading-[0.96]">One Wallet. Any AI. Anywhere.</h1>
        <p className="mt-5 text-base leading-7 text-white/60">A calm control layer for spending, routing, and using the best AI for every job.</p>
      </div>
      <PrimaryButton onClick={onRestart}>Back to dashboard</PrimaryButton>
    </div>
  )
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-[#63F7D4] px-5 text-base font-semibold text-[#06100D] shadow-[0_16px_38px_rgba(99,247,212,0.24),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:bg-[#7EF9DD] active:scale-[0.99]"
    >
      {children}
      <ArrowRight className="h-5 w-5" />
    </button>
  )
}

function TopBrand() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[#63F7D4] text-[#06100D] shadow-[0_10px_24px_rgba(99,247,212,0.18),inset_0_1px_0_rgba(255,255,255,0.4)]">
          <Route className="h-5 w-5" />
        </div>
        <div>
          <div className="text-base font-semibold">Ninjai</div>
          <div className="text-xs text-white/42">Universal AI wallet</div>
        </div>
      </div>
      <div className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/52 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">PAYG</div>
    </div>
  )
}

function Header({ title, copy }: { title: string; copy: string }) {
  return (
    <div>
      <TopBrand />
      <h1 className="mt-8 text-4xl font-semibold leading-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-white/58">{copy}</p>
    </div>
  )
}

function TrustRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <Icon className="h-5 w-5 text-[#63F7D4]" />
      <p className="text-sm text-white/64">{text}</p>
    </div>
  )
}

function FooterNote({ text }: { text: string }) {
  return (
    <>
      <div className="flex-1" />
      <p className="mb-4 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">{text}</p>
    </>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <Icon className="h-5 w-5 text-[#63F7D4]" />
      <div className="mt-4 text-xs text-white/42">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  )
}

function Insight({ label, value, copy }: { label: string; value: string; copy: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/52">{label}</span>
        <span className="text-xl font-semibold">{value}</span>
      </div>
      <p className="mt-2 text-sm text-white/48">{copy}</p>
    </div>
  )
}

function BottomNav({
  active,
  goHome,
  goInsights,
  goWallet,
}: {
  active: Step
  goHome: () => void
  goInsights: () => void
  goWallet: () => void
}) {
  const items = [
    { label: 'Home', icon: Home, onClick: goHome, active: ['home', 'streaming', 'routing'].includes(active) },
    { label: 'Wallet', icon: Wallet, onClick: goWallet, active: active === 'wallet' },
    { label: 'Insights', icon: LineChart, onClick: goInsights, active: active === 'insights' },
  ]

  return (
    <nav className="absolute inset-x-5 bottom-5 z-20 grid grid-cols-3 rounded-[24px] border border-white/10 bg-[#0B1018]/88 p-2 shadow-[0_14px_50px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex h-12 flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] transition ${
              item.active ? 'bg-[#63F7D4]/12 text-[#63F7D4]' : 'text-white/42'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

function isTabbed(step: Step) {
  return ['home', 'routing', 'streaming', 'wallet', 'insights'].includes(step)
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between text-[11px] font-medium text-white/54">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <ChartNoAxesColumnIncreasing className="h-3.5 w-3.5" />
        <div className="h-3 w-5 rounded-[4px] border border-white/40 p-0.5">
          <div className="h-full w-3.5 rounded-[2px] bg-white/64" />
        </div>
      </div>
    </div>
  )
}

function ProgressDots({ step }: { step: Step }) {
  const activeIndex = onboardingSteps.indexOf(step)

  return (
    <div className="absolute left-5 right-5 top-12 z-10 flex items-center gap-2">
      {onboardingSteps.map((item, index) => (
        <div key={item} className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-[#63F7D4]"
            initial={false}
            animate={{ width: index <= activeIndex ? '100%' : '0%' }}
            transition={{ duration: 0.32 }}
          />
        </div>
      ))}
    </div>
  )
}

export default App
