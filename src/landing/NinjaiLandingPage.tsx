import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Compass,
  Copy,
  CreditCard,
  Gauge,
  GraduationCap,
  Layers3,
  LockKeyhole,
  Mail,
  MousePointer2,
  PenLine,
  Play,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Wand2,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

type PreviewStep = 'idle' | 'highlight' | 'ask' | 'routing' | 'response' | 'done'
type WorkflowTab = 'Students' | 'Creators' | 'Developers' | 'Power Users'

const accent = '#63F7D4'
const sectionPad = 'relative z-10 px-4 py-20 sm:px-6 lg:px-8'

const messyCards = [
  'ChatGPT Plus',
  'Claude Pro',
  'Gemini Advanced',
  'API Credits',
  'Unused subscriptions',
  'Multiple tabs',
  'No spend control',
]

const modes = [
  { label: 'Instant', icon: Zap, copy: 'Fast answers for small asks.' },
  { label: 'Smart', icon: Brain, copy: 'Balanced quality, speed, and price.' },
  { label: 'Deep', icon: Layers3, copy: 'More reasoning for hard tasks.' },
  { label: 'Efficient', icon: Gauge, copy: 'Lowest cost when quality is similar.' },
]

const workflowCopy: Record<WorkflowTab, { icon: LucideIcon; context: string; ask: string; route: string; cost: string }> = {
  Students: {
    icon: GraduationCap,
    context: 'Reading a dense research paragraph',
    ask: 'Explain this in plain English',
    route: 'Smart routes to Claude',
    cost: '$0.0012',
  },
  Creators: {
    icon: PenLine,
    context: 'Drafting a newsletter hook',
    ask: 'Rewrite with sharper tone',
    route: 'Instant routes to GPT',
    cost: '$0.0018',
  },
  Developers: {
    icon: Code2,
    context: 'Reviewing an unfamiliar API error',
    ask: 'Find likely cause and fix',
    route: 'Deep routes to Claude',
    cost: '$0.0064',
  },
  'Power Users': {
    icon: Wand2,
    context: 'Comparing notes across tools',
    ask: 'Summarize and extract next actions',
    route: 'Efficient routes to Gemini',
    cost: '$0.0009',
  },
}

const routerTasks = ['Summarize', 'Rewrite', 'Explain', 'Translate', 'Research', 'Debug']
const providerRoutes = [
  ['Summarize', 'Efficient model'],
  ['Research', 'Deep reasoning model'],
  ['Rewrite', 'Fast balanced model'],
]

function NinjaiLandingPage() {
  const reduceMotion = useReducedMotion()

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#070A0F] text-[#F6F8FB] antialiased">
      <Background />
      <div className="relative z-10">
        <Nav />
        <Hero reduceMotion={reduceMotion} />
        <ProblemSection />
        <MagicMomentSection />
        <HowItWorks />
        <PaygEconomics />
        <SmartRouterSection />
        <WorkflowsSection />
        <WalletTrustSection />
        <WhyNowSection />
        <InteractivePreview />
        <EarlyAccessSection />
        <Footer />
      </div>
    </main>
  )
}

function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(99,247,212,0.14),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(79,124,255,0.12),transparent_26%),linear-gradient(180deg,#070A0F,#090D14_52%,#070A0F)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:44px_44px]" />
    </>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#070A0F]/72 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[#63F7D4] text-[#06100D] shadow-[0_12px_30px_rgba(99,247,212,0.18)]">
            <Route className="h-5 w-5" />
          </div>
          <span className="text-base font-bold">Ninjai.app</span>
        </a>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[#A7B0C0] xl:flex">
          <a href="#problem" className="transition hover:text-[#F6F8FB]">Problem</a>
          <a href="#magic" className="transition hover:text-[#F6F8FB]">Product</a>
          <a href="#how-it-works" className="transition hover:text-[#F6F8FB]">How</a>
          <a href="#economics" className="transition hover:text-[#F6F8FB]">PAYG</a>
          <a href="#router" className="transition hover:text-[#F6F8FB]">Router</a>
          <a href="#workflows" className="transition hover:text-[#F6F8FB]">Workflows</a>
          <a href="#wallet" className="transition hover:text-[#F6F8FB]">Wallet</a>
          <a href="#why-now" className="transition hover:text-[#F6F8FB]">Why now</a>
          <a href="#access" className="transition hover:text-[#F6F8FB]">Access</a>
        </nav>
        <a href="#access" className="rounded-full bg-[#63F7D4] px-4 py-2 text-sm font-bold text-[#06100D] transition hover:bg-[#7EF9DD]">
          Join Beta
        </a>
      </div>
    </header>
  )
}

function Hero({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <section id="top" className="relative z-10 px-4 pb-12 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#63F7D4]/25 bg-[#63F7D4]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">
            <Sparkles className="h-3.5 w-3.5" />
            AI wallet layer
          </div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] text-[#F6F8FB] sm:text-6xl lg:text-7xl">
            One Wallet For AI.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A7B0C0]">
            Access leading AI models through one intelligent PAYG wallet. Ninjai routes every task for speed, quality, and cost.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#access" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#63F7D4] px-6 text-sm font-bold text-[#06100D] shadow-[0_18px_44px_rgba(99,247,212,0.2)] transition hover:bg-[#7EF9DD]">
              Join Beta
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#preview" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#273041] bg-[#10141C] px-6 text-sm font-bold text-[#F6F8FB] transition hover:border-[#63F7D4]/45">
              <Play className="h-4 w-4 text-[#63F7D4]" />
              Watch Demo
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-[#A7B0C0]">
            {['No subscriptions.', 'No provider lock-in.', 'No wasted AI spend.'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                <Check className="h-3.5 w-3.5 text-[#63F7D4]" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  const steps = ['Highlight text', 'Ask Ninjai', 'Smart routing', 'Response', '$0.0012']

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
      <div className="absolute -inset-6 rounded-[36px] bg-[#63F7D4]/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[30px] border border-[#273041] bg-[#10141C] shadow-[0_34px_120px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3 border-b border-[#273041] bg-[#171C26] px-4 py-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF6B5F]" />
            <span className="h-3 w-3 rounded-full bg-[#FFB84D]" />
            <span className="h-3 w-3 rounded-full bg-[#3DFF9F]" />
          </div>
          <div className="flex h-9 flex-1 items-center rounded-full border border-[#273041] bg-[#070A0F] px-4 text-xs text-[#A7B0C0]">
            research.edu/article/learning-ai
          </div>
          <div className="rounded-full border border-[#63F7D4]/35 bg-[#63F7D4]/10 px-3 py-2 text-xs font-bold">Ninjai</div>
        </div>
        <div className="bg-[#F6F8FB] p-5 text-[#111827] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#697386]">Selected article</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">AI study tools are moving into the workflow.</h2>
          <div className="mt-5 rounded-[18px] border border-[#63F7D4]/30 bg-[#63F7D4]/18 p-4 text-sm leading-7 text-[#344054] shadow-[0_18px_45px_rgba(99,247,212,0.16)]">
            Students need AI support while they read, write, research, and revise inside the tools they already use.
          </div>
          <motion.div
            animate={{ y: [0, -4, 0], opacity: [0.95, 1, 0.95] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="ml-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-[#63F7D4]/35 bg-[#10141C] px-4 py-2 text-sm font-bold text-[#F6F8FB] shadow-[0_0_34px_rgba(99,247,212,0.2)]"
          >
            <Sparkles className="h-4 w-4 text-[#63F7D4]" />
            Ask Ninjai
          </motion.div>
          <div className="mt-5 rounded-[22px] border border-[#273041] bg-[#10141C] p-4 text-[#F6F8FB]">
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <motion.span
                  key={step}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.45, 1, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.22 }}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-[#DCE3EE]"
                >
                  {step}
                </motion.span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-[#DCE3EE]">
              Summary streamed via Smart Mode. Claude selected for balanced reasoning. Wallet updated from $10.00 to $9.9988.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProblemSection() {
  return (
    <section id="problem" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="The problem" title="AI access is fragmented." copy="Users are juggling multiple subscriptions, disconnected billing, separate apps, provider lock-in, and unpredictable usage. AI has become powerful, but accessing it still feels messy." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {messyCards.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#273041] bg-[#10141C] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-[#A7B0C0]">
                  <Copy className="h-5 w-5" />
                </div>
                <h3 className="font-bold">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-[#697386]">Another separate place to pay, manage, remember, or abandon.</p>
              </div>
            ))}
          </div>
          <div className="rounded-[28px] border border-[#63F7D4]/25 bg-[#63F7D4]/8 p-6 shadow-[0_28px_90px_rgba(99,247,212,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Wallet className="h-8 w-8 text-[#63F7D4]" />
            <h3 className="mt-6 text-3xl font-bold">Ninjai cleans it up.</h3>
            <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">The AI ecosystem is expanding faster than the access layer. Ninjai turns fragmented consumption into one controlled wallet experience.</p>
            <div className="mt-6 grid gap-3">
              {['One wallet', 'One balance', 'Any AI', 'PAYG usage', 'Smart routing', 'Unified spend control'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-[20px] border border-[#63F7D4]/20 bg-[#10141C] p-4">
                  <span className="font-semibold">{item}</span>
                  <Check className="h-5 w-5 text-[#63F7D4]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MagicMomentSection() {
  return (
    <section id="magic" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Magic moment" title="AI where you already work." copy="Highlight text anywhere in the browser and ask Ninjai instantly. Summarize, explain, rewrite, translate, or ask follow-up questions without opening another app." />
        <div className="mt-10">
          <BrowserMockup compact={false} />
        </div>
      </div>
    </section>
  )
}

function BrowserMockup({ compact }: { compact: boolean }) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#273041] bg-[#10141C] shadow-[0_34px_120px_rgba(0,0,0,0.42)]">
      <div className="flex items-center gap-3 border-b border-[#273041] bg-[#171C26] px-4 py-3">
        <div className="hidden gap-2 sm:flex">
          <span className="h-3 w-3 rounded-full bg-[#FF6B5F]" />
          <span className="h-3 w-3 rounded-full bg-[#FFB84D]" />
          <span className="h-3 w-3 rounded-full bg-[#3DFF9F]" />
        </div>
        <div className="flex h-9 flex-1 items-center rounded-full border border-[#273041] bg-[#070A0F] px-4 text-xs text-[#A7B0C0]">docs.learning.ai/research</div>
        <div className="rounded-full border border-[#63F7D4]/35 bg-[#63F7D4]/10 px-3 py-2 text-xs font-bold">Ninjai</div>
      </div>
      <div className="relative bg-[#F6F8FB] p-5 text-[#111827] sm:p-8">
        <h3 className="max-w-2xl text-3xl font-bold leading-tight">The Future of AI Productivity in Education</h3>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#344054]">
          Educators are moving from occasional AI experiments toward daily systems that support planning, feedback, research, and student reflection.
        </p>
        <div className="mt-5 max-w-3xl rounded-[18px] border border-[#63F7D4]/30 bg-[#63F7D4]/18 p-4 text-sm leading-7 text-[#344054]">
          AI is becoming a continuous study companion rather than a standalone destination. Students increasingly need help while they read, write, research, and revise inside the tools they already use.
        </div>
        <div className="mt-4 flex w-fit items-center gap-2 rounded-full border border-[#63F7D4]/35 bg-[#10141C] px-4 py-2 text-sm font-bold text-[#F6F8FB] shadow-[0_0_34px_rgba(99,247,212,0.18)]">
          <Sparkles className="h-4 w-4 text-[#63F7D4]" />
          Ask Ninjai
        </div>
        <div className={`mt-5 grid gap-4 ${compact ? '' : 'lg:grid-cols-[340px_1fr]'}`}>
          <div className="rounded-[24px] border border-[#273041] bg-[#10141C] p-4 text-[#F6F8FB]">
            <h4 className="font-bold">Quick actions</h4>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {['Summarize', 'Explain', 'Rewrite', 'Translate', 'Quiz Me', 'Ask Anything'].map((item) => (
                <button key={item} className="rounded-[16px] border border-[#273041] bg-white/[0.04] px-3 py-3 text-left text-xs font-bold text-[#DCE3EE]">
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-[16px] border border-[#273041] bg-[#171C26] p-3 text-xs text-[#A7B0C0]">
              Mode: Smart · Estimated cost: ~$0.001 · Wallet: $10.00
            </div>
          </div>
          <div className="rounded-[24px] border border-[#273041] bg-[#10141C] p-5 text-[#F6F8FB]">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Summary</h4>
              <span className="rounded-full border border-[#63F7D4]/30 bg-[#63F7D4]/10 px-3 py-1 text-xs font-bold text-[#63F7D4]">Cost $0.0012</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#DCE3EE]">
              This passage explains how AI is becoming contextual learning support, available directly inside a student workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="How it works" title="AI access, simplified." copy="Users choose outcomes. Ninjai handles complexity: walleting, routing, provider choice, response delivery, and task-level billing." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <StepCard icon={Wallet} title="Fund your wallet" copy="Add a small balance once. Use it across AI models and workflows." />
          <StepCard icon={MousePointer2} title="Ask Ninjai anywhere" copy="Use the browser extension, mobile app, or API to access AI in context." />
          <StepCard icon={Route} title="Ninjai routes the task" copy="Ninjai selects the best model for speed, quality, and cost, then charges only for actual usage." />
        </div>
        <FlowDiagram />
      </div>
    </section>
  )
}

function FlowDiagram() {
  const nodes = ['Wallet', 'Ask', 'Router', 'GPT / Claude / Gemini', 'Response', 'Deduction']
  return (
    <div className="mt-8 overflow-x-auto rounded-[28px] border border-[#273041] bg-[#10141C] p-4">
      <div className="flex min-w-[860px] items-center gap-3">
        {nodes.map((node, index) => (
          <div key={node} className="flex flex-1 items-center gap-3">
            <div className={`flex h-20 flex-1 items-center justify-center rounded-[22px] border px-4 text-center text-sm font-bold ${index === 2 ? 'border-[#63F7D4]/45 bg-[#63F7D4]/12 text-[#63F7D4]' : 'border-[#273041] bg-white/[0.035] text-[#DCE3EE]'}`}>
              {node}
            </div>
            {index < nodes.length - 1 && <ChevronRight className="h-5 w-5 shrink-0 text-[#697386]" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function PaygEconomics() {
  return (
    <section id="economics" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="PAYG economics" title="Stop paying for AI you do not use." copy="Most AI tools still force fixed subscriptions. Ninjai turns AI into usage-based utility infrastructure: pay only when you actually use it." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <SpendChart
            title="Traditional AI Stack"
            rows={[
              ['Monthly spend', 60, '#A7B0C0'],
              ['Actual usage value', 12, accent],
              ['Wasted spend', 48, '#FFB84D'],
            ]}
          />
          <SpendChart
            title="Ninjai PAYG"
            rows={[
              ['Actual usage', 12, accent],
              ['Wasted spend', 0, '#3DFF9F'],
            ]}
          />
        </div>
        <div className="mt-6 rounded-[24px] border border-[#273041] bg-[#10141C] p-5 text-sm leading-7 text-[#A7B0C0]">
          <span className="font-bold text-[#F6F8FB]">Investor interpretation:</span> PAYG creates a lower-friction entry point into AI consumption while centralizing wallet throughput.
        </div>
      </div>
    </section>
  )
}

function SmartRouterSection() {
  return (
    <section id="router" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Smart router" title="The intelligence is in the orchestration." copy="Different models are better for different tasks. Ninjai routes requests across providers based on task type, latency, quality, cost, and user preferences." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-[#273041] bg-[#10141C] p-6">
            <h3 className="text-xl font-bold">Task chips flow into the router.</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {routerTasks.map((task) => (
                <span
                  key={task}
                  className="rounded-full border border-[#273041] bg-white/[0.04] px-4 py-2 text-sm font-bold text-[#DCE3EE]"
                >
                  {task}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-2">
              {providerRoutes.map(([task, route]) => (
                <div key={task} className="flex items-center justify-between rounded-[18px] border border-[#273041] bg-white/[0.035] px-4 py-3 text-sm">
                  <span className="font-bold text-[#F6F8FB]">Task: {task}</span>
                  <span className="text-[#63F7D4]">{route}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] border border-[#63F7D4]/30 bg-[#63F7D4]/10 p-5">
              <Route className="h-7 w-7 text-[#63F7D4]" />
              <h4 className="mt-4 text-2xl font-bold">Ninjai Router</h4>
              <p className="mt-2 text-sm leading-6 text-[#A7B0C0]">Selects the right model and mode for the task.</p>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#A7B0C0]">Users should not need to know which model to choose. Ninjai optimizes behind the scenes.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {modes.map((mode) => (
              <InfoCard key={mode.label} icon={mode.icon} title={mode.label} copy={mode.copy} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowsSection() {
  const [tab, setTab] = useState<WorkflowTab>('Students')
  const current = workflowCopy[tab]
  const Icon = current.icon

  return (
    <section id="workflows" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Workflows" title="Built for the way people actually use AI." copy="Ninjai fits real workflows for early testers: students, creators, developers, and AI power users." />
        <div className="mt-8 flex flex-wrap gap-2">
          {(Object.keys(workflowCopy) as WorkflowTab[]).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${tab === item ? 'border-[#63F7D4] bg-[#63F7D4]/12 text-[#63F7D4]' : 'border-[#273041] bg-[#10141C] text-[#A7B0C0]'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-[28px] border border-[#273041] bg-[#10141C] p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-4 lg:grid-cols-4">
              <WorkflowNode icon={Icon} label="Context" value={current.context} />
              <WorkflowNode icon={Sparkles} label="Ask Ninjai" value={current.ask} />
              <WorkflowNode icon={Route} label="Routed response" value={current.route} />
              <WorkflowNode icon={CircleDollarSign} label="Wallet deduction" value={current.cost} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function WalletTrustSection() {
  const features = [
    ['Daily spend caps', ShieldCheck],
    ['Real-time balance', Wallet],
    ['Transaction history', CreditCard],
    ['Provider transparency', Compass],
    ['Usage alerts', Gauge],
    ['Privacy-first extension behavior', LockKeyhole],
  ] as const

  return (
    <section id="wallet" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Wallet trust" title="You stay in control of every AI dollar." copy="Set daily limits, see every transaction, track usage in real time, and keep AI spend predictable." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-[28px] border border-[#63F7D4]/25 bg-[#10141C] p-6 shadow-[0_28px_90px_rgba(99,247,212,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#697386]">AI Wallet Balance</p>
            <p className="mt-3 text-5xl font-bold">$18.42</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-[37%] rounded-full bg-[#63F7D4]" />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#A7B0C0]">
              <span>Today</span>
              <span>$1.84 / $5.00</span>
            </div>
            <div className="mt-6 rounded-[20px] border border-[#273041] bg-white/[0.035] p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Summary</span>
                <span className="text-[#63F7D4]">$0.0012</span>
              </div>
              <p className="mt-1 text-sm text-[#697386]">Smart Mode · Claude · Just now</p>
            </div>
            <div className="mt-5 space-y-2 text-sm leading-6 text-[#A7B0C0]">
              <p>Ninjai only acts when you invoke it.</p>
              <p>Your balance updates after every task.</p>
              <p>Stablecoins may be supported as optional funding rails, never required.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(([feature, Icon]) => (
              <InfoCard key={feature} icon={Icon} title={feature} copy="Built to make usage clear before, during, and after each AI task." />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyNowSection() {
  return (
    <section id="why-now" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Why now" title="AI consumption is becoming infrastructure." copy="AI usage is moving from occasional chatbot sessions to continuous, embedded, multi-model workflows. The next layer is not another model: it is the financial and orchestration layer that makes AI consumption usable, affordable, and intelligent." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <ChartCard title="AI market growth" value="+38%" copy="Illustrative annual growth in paid AI usage." bars={[35, 48, 62, 78, 92]} />
          <ChartCard title="Student AI adoption" value="72%" copy="Illustrative share using AI in weekly workflows." bars={[22, 34, 49, 58, 72]} />
          <ChartCard title="Provider fragmentation" value="6+" copy="Illustrative tools used by active AI users." bars={[18, 28, 42, 66, 84]} />
        </div>
        <div className="mt-6 rounded-[24px] border border-[#273041] bg-[#10141C] p-5 text-sm leading-7 text-[#A7B0C0]">
          As AI usage grows, users need a new access layer.
        </div>
      </div>
    </section>
  )
}

function InteractivePreview() {
  const [step, setStep] = useState<PreviewStep>('idle')
  const balance = step === 'done' ? '$9.9988' : '$10.00'
  const nextStep = useMemo(() => {
    const order: PreviewStep[] = ['idle', 'highlight', 'ask', 'routing', 'response', 'done']
    return order[Math.min(order.indexOf(step) + 1, order.length - 1)]
  }, [step])

  return (
    <section id="preview" className={sectionPad}>
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Interactive preview" title="Try the Ninjai flow." copy="Experience the website proof surface: highlight sample text, ask Ninjai, watch routing, see the response, and observe wallet deduction." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-[28px] border border-[#273041] bg-[#10141C] p-6">
            <p className="text-sm leading-7 text-[#A7B0C0]">Click through the sequence: highlight text, ask Ninjai, summarize, route, stream, and deduct from the wallet.</p>
          <button
            onClick={() => setStep(nextStep)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#63F7D4] px-5 text-sm font-bold text-[#06100D] transition hover:bg-[#7EF9DD]"
          >
              {step === 'done' ? 'Flow complete' : 'Next step'}
            <ArrowRight className="h-4 w-4" />
          </button>
          <a href="#access" className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#63F7D4]/35 bg-[#63F7D4]/10 text-sm font-bold text-[#63F7D4] transition hover:border-[#63F7D4]/60">
            Join Beta
          </a>
          <button onClick={() => setStep('idle')} className="mt-3 h-11 w-full rounded-full border border-[#273041] text-sm font-bold text-[#A7B0C0] transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]">
            Reset preview
          </button>
          </div>
          <PreviewCanvas step={step} balance={balance} />
        </div>
      </div>
    </section>
  )
}

function PreviewCanvas({ step, balance }: { step: PreviewStep; balance: string }) {
  return (
    <div className="rounded-[30px] border border-[#273041] bg-[#10141C] p-4">
      <div className="rounded-[24px] bg-[#F6F8FB] p-5 text-[#111827]">
        <h3 className="text-2xl font-bold">Productivity notes</h3>
        <p className="mt-4 text-sm leading-7 text-[#344054]">AI can become useful when it appears directly inside the work people are already doing.</p>
        <div className={`mt-4 rounded-[18px] border p-4 text-sm leading-7 transition ${step !== 'idle' ? 'border-[#63F7D4]/35 bg-[#63F7D4]/18' : 'border-slate-200 bg-white'}`}>
          Users need contextual help for summarizing, explaining, rewriting, and asking follow-up questions without switching tools.
        </div>
        {(step === 'ask' || step === 'routing' || step === 'response' || step === 'done') && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#63F7D4]/35 bg-[#10141C] px-4 py-2 text-sm font-bold text-[#F6F8FB]">
            <Sparkles className="h-4 w-4 text-[#63F7D4]" />
            Ask Ninjai
          </div>
        )}
        {(step === 'routing' || step === 'response' || step === 'done') && (
          <div className="mt-4 rounded-[22px] border border-[#273041] bg-[#10141C] p-4 text-[#F6F8FB]">
            {step === 'routing' ? (
              <div className="space-y-3 text-sm font-bold">
                {['Analyzing task', 'Selecting best AI', 'Optimizing cost'].map((item) => (
                  <div key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#63F7D4]" />{item}</div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Summary</h4>
                  <span className="rounded-full bg-[#63F7D4]/10 px-3 py-1 text-xs font-bold text-[#63F7D4]">Smart · Claude</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#DCE3EE]">Ninjai summarized the passage in context and charged only $0.0012 for the routed task.</p>
              </>
            )}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between rounded-[18px] border border-slate-200 bg-white p-4">
          <span className="text-sm font-bold">Wallet</span>
          <span className="font-bold text-[#0E9F79]">{balance}</span>
        </div>
      </div>
    </div>
  )
}

function EarlyAccessSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="access" className={sectionPad}>
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[32px] border border-[#273041] bg-[#10141C] p-6 shadow-[0_34px_120px_rgba(0,0,0,0.36)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">Early access</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Be early to the AI wallet layer.</h2>
          <p className="mt-5 text-base leading-7 text-[#A7B0C0]">Ninjai is opening early access for students, creators, developers, and AI power users.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
          className="grid gap-4"
        >
          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#DCE3EE]">Email</span>
            <div className="flex h-12 items-center gap-3 rounded-[18px] border border-[#273041] bg-[#070A0F] px-4">
              <Mail className="h-4 w-4 text-[#63F7D4]" />
              <input required type="email" placeholder="you@company.com" className="w-full bg-transparent text-sm text-[#F6F8FB] outline-none placeholder:text-[#697386]" />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#DCE3EE]">Use case</span>
            <select className="h-12 rounded-[18px] border border-[#273041] bg-[#070A0F] px-4 text-sm font-bold text-[#F6F8FB] outline-none">
              <option>Student</option>
              <option>Creator</option>
              <option>Developer</option>
              <option>Power User</option>
              <option>Investor</option>
            </select>
          </label>
          <button className="h-12 rounded-full bg-[#63F7D4] text-sm font-bold text-[#06100D] transition hover:bg-[#7EF9DD]">Request Early Access</button>
          <button type="button" className="h-12 rounded-full border border-[#273041] bg-[#070A0F] text-sm font-bold text-[#F6F8FB] transition hover:border-[#63F7D4]/45">
            I am an investor
          </button>
          {submitted && <p className="rounded-[18px] border border-[#63F7D4]/30 bg-[#63F7D4]/10 p-3 text-sm font-bold text-[#63F7D4]">Request captured for the demo.</p>}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#273041] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">The financial and orchestration layer for AI consumption.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#A7B0C0]">Ninjai combines walleting, PAYG billing, smart routing, browser-native AI access, and provider abstraction into a new infrastructure layer for AI consumption.</p>
          <p className="mt-3 text-lg font-bold text-[#63F7D4]">One Wallet. Any AI. Anywhere.</p>
        </div>
        <p className="text-sm text-[#697386]">Ninjai.app · Early access preview</p>
      </div>
    </footer>
  )
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#63F7D4]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-[#A7B0C0]">{copy}</p>
    </div>
  )
}

function StepCard({ icon: Icon, title, copy }: { icon: LucideIcon; title: string; copy: string }) {
  return <InfoCard icon={Icon} title={title} copy={copy} />
}

function InfoCard({ icon: Icon, title, copy }: { icon: LucideIcon; title: string; copy: string }) {
  return (
    <div className="rounded-[24px] border border-[#273041] bg-[#10141C] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#63F7D4]/10 text-[#63F7D4]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#A7B0C0]">{copy}</p>
    </div>
  )
}

function SpendChart({ title, rows }: { title: string; rows: Array<[string, number, string]> }) {
  const max = Math.max(...rows.map((row) => row[1]), 1)
  return (
    <div className="rounded-[28px] border border-[#273041] bg-[#10141C] p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-6 space-y-4">
        {rows.map(([label, value, color]) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#DCE3EE]">{label}</span>
              <span className="font-bold">${value}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkflowNode({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#273041] bg-white/[0.035] p-4">
      <Icon className="h-5 w-5 text-[#63F7D4]" />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#697386]">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#F6F8FB]">{value}</p>
    </div>
  )
}

function ChartCard({ title, value, copy, bars }: { title: string; value: string; copy: string; bars: number[] }) {
  return (
    <div className="rounded-[28px] border border-[#273041] bg-[#10141C] p-6">
      <div className="flex items-center justify-between">
        <TrendingUp className="h-6 w-6 text-[#63F7D4]" />
        <span className="rounded-full border border-[#273041] bg-white/[0.04] px-3 py-1 text-xs font-bold text-[#A7B0C0]">Illustrative</span>
      </div>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-4xl font-bold text-[#63F7D4]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#A7B0C0]">{copy}</p>
      <div className="mt-6 flex h-24 items-end gap-2">
        {bars.map((bar, index) => (
          <div key={`${bar}-${index}`} className="flex flex-1 items-end rounded-full bg-white/8">
            <div className="w-full rounded-full bg-[#63F7D4]" style={{ height: `${bar}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NinjaiLandingPage
