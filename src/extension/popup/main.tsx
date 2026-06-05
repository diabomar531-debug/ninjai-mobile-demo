/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  Wallet,
  Zap,
} from 'lucide-react'
import '../../styles.css'
import { DEFAULT_WALLET_STATE, type WalletState } from '../shared/wallet'

type PopupScreen = 'home' | 'topup' | 'dashboard' | 'settings'
type WalletMode = WalletState['mode']

const modes: WalletMode[] = ['Instant', 'Smart', 'Deep', 'Efficient']
const topUpOptions = [5, 10, 20, 'Custom'] as const

function PopupApp() {
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_WALLET_STATE)
  const [popupScreen, setPopupScreen] = useState<PopupScreen>('home')
  const [toast, setToast] = useState('')

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'NINJAI_GET_WALLET' }).then((state) => {
      setWallet(state as WalletState)
    })
  }, [])

  const saveWallet = (nextWallet: WalletState) => {
    setWallet(nextWallet)
    return chrome.storage.local.set(nextWallet)
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const goHome = (message?: string) => {
    setPopupScreen('home')
    if (message) {
      showToast(message)
    }
  }

  return (
    <main className="relative max-h-[600px] w-[360px] overflow-y-auto bg-[#070A0F] p-4 text-[#F6F8FB] antialiased">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,247,212,0.16),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(138,108,255,0.14),transparent_28%)]" />
      <div className="relative">
        <AnimatePresence mode="wait">
          {popupScreen === 'home' && (
            <PopupHome
              key="home"
              wallet={wallet}
              onNavigate={setPopupScreen}
              onTryEfficient={() => {
                const nextWallet = { ...wallet, mode: 'Efficient' as const }
                saveWallet(nextWallet).then(() => goHome('Efficient mode queued'))
              }}
            />
          )}
          {popupScreen === 'topup' && (
            <TopUpScreen
              key="topup"
              wallet={wallet}
              onBack={() => goHome()}
              onAddFunds={(amount) => {
                const nextWallet = { ...wallet, walletBalance: Number((wallet.walletBalance + amount).toFixed(4)) }
                saveWallet(nextWallet).then(() => goHome(`Wallet topped up · $${amount} added`))
              }}
            />
          )}
          {popupScreen === 'dashboard' && (
            <DashboardScreen
              key="dashboard"
              onBack={() => goHome()}
              onTryEfficient={() => {
                const nextWallet = { ...wallet, mode: 'Efficient' as const }
                saveWallet(nextWallet).then(() => goHome('Efficient mode queued'))
              }}
            />
          )}
          {popupScreen === 'settings' && (
            <SettingsScreen
              key="settings"
              wallet={wallet}
              onBack={() => goHome()}
              onSave={(mode, dailyLimit) => {
                const nextWallet = { ...wallet, mode, dailyLimit }
                saveWallet(nextWallet).then(() => goHome('Settings saved'))
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <Toast message={toast} />
    </main>
  )
}

function PopupHome({
  wallet,
  onNavigate,
  onTryEfficient,
}: {
  wallet: WalletState
  onNavigate: (screen: PopupScreen) => void
  onTryEfficient: () => void
}) {
  return (
    <Screen>
      <PopupHeader wallet={wallet} />

      <section className="mt-5 rounded-[24px] border border-[#273041] bg-[#10141C] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#697386]">AI Wallet Balance</p>
        <motion.div
          key={wallet.walletBalance}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-[28px] font-bold leading-none"
        >
          ${wallet.walletBalance.toFixed(wallet.walletBalance % 1 === 0 ? 2 : 4)}
        </motion.div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-[#63F7D4]" style={{ width: `${Math.max((wallet.dailySpend / wallet.dailyLimit) * 100, 1)}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-[#A7B0C0]">
          <span>Today: ${wallet.dailySpend.toFixed(4)} / ${wallet.dailyLimit.toFixed(2)}</span>
          <span>Current Mode: {wallet.mode}</span>
        </div>
      </section>

      <section className="mt-3">
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {['Summarize Page', 'Ask About Page', 'Rewrite Selected Text'].map((label) => (
            <button key={label} className="min-h-16 rounded-[18px] border border-[#273041] bg-[#10141C] px-2 py-3 text-xs font-bold leading-4 text-[#DCE3EE] transition hover:border-[#63F7D4]/45">
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <SectionLabel>Recent Activity</SectionLabel>
        <div className="space-y-2">
          {wallet.activity.slice(0, 3).map((item) => (
            <div key={`${item.task}-${item.time}`} className="flex items-center justify-between rounded-[16px] border border-[#273041] bg-[#10141C] px-3 py-2">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#63F7D4]" />
                <div>
                  <p className="text-sm font-semibold">{item.task} · {item.provider}</p>
                  <p className="text-[11px] text-[#697386]">{item.mode} · {item.time}</p>
                </div>
              </div>
              <span className="text-xs text-[#A7B0C0]">${item.cost.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </section>

      <InsightBlock onClick={onTryEfficient} />

      <footer className="mt-3 grid grid-cols-3 gap-2 pb-1">
        <FooterButton icon={CreditCard} label="Top Up" onClick={() => onNavigate('topup')} />
        <FooterButton icon={LayoutDashboard} label="Dashboard" onClick={() => onNavigate('dashboard')} />
        <FooterButton icon={Settings} label="Settings" onClick={() => onNavigate('settings')} />
      </footer>
    </Screen>
  )
}

function TopUpScreen({
  wallet,
  onBack,
  onAddFunds,
}: {
  wallet: WalletState
  onBack: () => void
  onAddFunds: (amount: number) => void
}) {
  const [selectedAmount, setSelectedAmount] = useState<number | 'Custom'>(10)
  const [customAmount, setCustomAmount] = useState(15)
  const amount = selectedAmount === 'Custom' ? customAmount : selectedAmount

  return (
    <Screen>
      <ScreenHeader title="Top Up Wallet" onBack={onBack} />
      <Card>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#697386]">Current balance</p>
        <p className="mt-2 text-[28px] font-bold">${wallet.walletBalance.toFixed(wallet.walletBalance % 1 === 0 ? 2 : 4)}</p>
        <p className="mt-2 text-sm leading-6 text-[#A7B0C0]">$10 powers ~8,000 quick AI tasks.</p>
      </Card>

      <section className="mt-4">
        <SectionLabel>Amount</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {topUpOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAmount(option)}
              className={`h-16 rounded-[18px] border text-sm font-bold transition ${
                selectedAmount === option ? 'border-[#63F7D4] bg-[#63F7D4]/12 text-[#63F7D4]' : 'border-[#273041] bg-[#10141C] text-[#F6F8FB]'
              }`}
            >
              {typeof option === 'number' ? `$${option}` : option}
            </button>
          ))}
        </div>
        {selectedAmount === 'Custom' && (
          <input
            value={customAmount}
            min={1}
            max={100}
            type="number"
            onChange={(event) => setCustomAmount(Number(event.target.value))}
            className="mt-3 h-11 w-full rounded-[16px] border border-[#273041] bg-[#10141C] px-3 text-sm font-bold text-[#F6F8FB] outline-none focus:border-[#63F7D4]"
          />
        )}
      </section>

      <section className="mt-4">
        <SectionLabel>Payment Method</SectionLabel>
        <div className="space-y-2">
          {['Apple Pay', 'Google Pay', 'Card ending 4242', 'Optional USDC Deposit'].map((method, index) => (
            <div key={method} className="flex items-center justify-between rounded-[18px] border border-[#273041] bg-[#10141C] px-3 py-3">
              <span className="text-sm font-semibold">{method}</span>
              {index === 2 && <Check className="h-4 w-4 text-[#63F7D4]" />}
            </div>
          ))}
        </div>
      </section>

      <PrimaryButton onClick={() => onAddFunds(amount)}>Add Funds</PrimaryButton>
    </Screen>
  )
}

function DashboardScreen({ onBack, onTryEfficient }: { onBack: () => void; onTryEfficient: () => void }) {
  return (
    <Screen>
      <ScreenHeader title="Dashboard" onBack={onBack} />
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Weekly spend" value="$2.84" />
        <Metric label="AI tasks" value="126" />
        <Metric label="Saved" value="27%" />
      </div>

      <Card className="mt-4">
        <SectionLabel>Usage By Task</SectionLabel>
        <Bar label="Summaries" value="42" percent={42} />
        <Bar label="Rewrites" value="31" percent={31} />
        <Bar label="Research" value="18" percent={18} />
        <Bar label="Explanations" value="35" percent={35} />
      </Card>

      <Card className="mt-3">
        <SectionLabel>Mode Mix</SectionLabel>
        <Bar label="Smart" value="64%" percent={64} />
        <Bar label="Efficient" value="22%" percent={22} />
        <Bar label="Deep" value="10%" percent={10} />
        <Bar label="Instant" value="4%" percent={4} />
      </Card>

      <Card className="mt-3">
        <SectionLabel>Provider Mix</SectionLabel>
        <Bar label="Claude" value="46%" percent={46} />
        <Bar label="GPT" value="32%" percent={32} />
        <Bar label="Gemini" value="22%" percent={22} />
      </Card>

      <InsightBlock onClick={onTryEfficient} />
    </Screen>
  )
}

function SettingsScreen({
  wallet,
  onBack,
  onSave,
}: {
  wallet: WalletState
  onBack: () => void
  onSave: (mode: WalletMode, dailyLimit: number) => void
}) {
  const [mode, setMode] = useState<WalletMode>(wallet.mode)
  const [dailyLimit, setDailyLimit] = useState(wallet.dailyLimit)
  const [toggles, setToggles] = useState({
    notify75: true,
    notify90: true,
    pauseAtLimit: true,
    onlyReadInvoked: true,
    discardSelectedText: true,
    showProvider: true,
    confirmDeep: true,
    preferLowestCost: true,
  })

  const setToggle = (key: keyof typeof toggles) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <Screen>
      <ScreenHeader title="Settings" onBack={onBack} />
      <section>
        <SectionLabel>Default Mode</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {modes.map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`h-12 rounded-[16px] border text-xs font-bold transition ${
                mode === item ? 'border-[#63F7D4] bg-[#63F7D4]/12 text-[#63F7D4]' : 'border-[#273041] bg-[#10141C] text-[#A7B0C0]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <SectionLabel>Daily Spend Limit</SectionLabel>
          <span className="text-sm font-bold text-[#63F7D4]">${dailyLimit.toFixed(0)}</span>
        </div>
        <input
          value={dailyLimit}
          type="range"
          min={1}
          max={25}
          onChange={(event) => setDailyLimit(Number(event.target.value))}
          className="mt-3 w-full accent-[#63F7D4]"
        />
        <input
          value={dailyLimit}
          min={1}
          max={25}
          type="number"
          onChange={(event) => setDailyLimit(Number(event.target.value))}
          className="mt-3 h-10 w-full rounded-[14px] border border-[#273041] bg-[#070A0F] px-3 text-sm font-bold text-[#F6F8FB] outline-none focus:border-[#63F7D4]"
        />
      </Card>

      <SettingsGroup title="Alerts">
        <ToggleRow label="Notify at 75%" enabled={toggles.notify75} onClick={() => setToggle('notify75')} />
        <ToggleRow label="Notify at 90%" enabled={toggles.notify90} onClick={() => setToggle('notify90')} />
        <ToggleRow label="Pause at limit" enabled={toggles.pauseAtLimit} onClick={() => setToggle('pauseAtLimit')} />
      </SettingsGroup>

      <SettingsGroup title="Privacy">
        <ToggleRow label="Only read pages when invoked" enabled={toggles.onlyReadInvoked} onClick={() => setToggle('onlyReadInvoked')} />
        <ToggleRow label="Discard selected text" enabled={toggles.discardSelectedText} onClick={() => setToggle('discardSelectedText')} />
        <ToggleRow label="Show provider used" enabled={toggles.showProvider} onClick={() => setToggle('showProvider')} />
      </SettingsGroup>

      <SettingsGroup title="Advanced">
        <ToggleRow label="Confirm before Deep mode" enabled={toggles.confirmDeep} onClick={() => setToggle('confirmDeep')} />
        <ToggleRow label="Prefer lowest cost when quality is similar" enabled={toggles.preferLowestCost} onClick={() => setToggle('preferLowestCost')} />
      </SettingsGroup>

      <PrimaryButton onClick={() => onSave(mode, dailyLimit)}>Save Settings</PrimaryButton>
    </Screen>
  )
}

function PopupHeader({ wallet }: { wallet: WalletState }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#63F7D4] text-[#06100D] shadow-[0_12px_30px_rgba(99,247,212,0.2)]">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Ninjai</h1>
          <p className="text-xs font-medium text-[#697386]">Ambient AI wallet</p>
        </div>
      </div>
      <span className="rounded-full border border-[#273041] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-[#A7B0C0]">
        {wallet.mode}
      </span>
    </header>
  )
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#273041] bg-[#10141C] text-[#A7B0C0] transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-xs text-[#697386]">Ninjai wallet controls</p>
      </div>
    </header>
  )
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[24px] border border-[#273041] bg-[#10141C] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${className}`}>
      {children}
    </section>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#697386]">{children}</p>
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#273041] bg-[#10141C] p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#697386]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[#F6F8FB]">{value}</p>
    </div>
  )
}

function Bar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#DCE3EE]">{label}</span>
        <span className="text-[#A7B0C0]">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-[#63F7D4]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function InsightBlock({ onClick }: { onClick: () => void }) {
  return (
    <section className="mt-4 rounded-[18px] border border-[#8A6CFF]/25 bg-[#8A6CFF]/10 p-3">
      <div className="flex gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C9BDFF]" />
        <div>
          <p className="text-sm font-semibold leading-5 text-[#F6F8FB]">Efficient mode could save ~32% on summaries.</p>
          <button onClick={onClick} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#8A6CFF]/35 bg-[#8A6CFF]/16 px-3 py-1.5 text-xs font-bold text-[#F6F8FB]">
            <Zap className="h-3.5 w-3.5" />
            Try Efficient Next Time
          </button>
        </div>
      </div>
    </section>
  )
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="mt-3">
      <SectionLabel>{title}</SectionLabel>
      <div className="space-y-2">{children}</div>
    </Card>
  )
}

function ToggleRow({ label, enabled, onClick }: { label: string; enabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-[16px] border border-[#273041] bg-[#070A0F] px-3 py-2 text-left text-sm font-semibold text-[#DCE3EE]">
      <span>{label}</span>
      {enabled ? <Check className="h-4 w-4 text-[#63F7D4]" /> : <ToggleLeft className="h-4 w-4 text-[#697386]" />}
    </button>
  )
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-4 h-12 w-full rounded-[18px] bg-[#63F7D4] text-sm font-bold text-[#06100D] shadow-[0_16px_36px_rgba(99,247,212,0.18)] transition hover:bg-[#7EF9DD] active:scale-[0.99]">
      {children}
    </button>
  )
}

function FooterButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#273041] bg-[#10141C] text-xs font-bold text-[#A7B0C0] transition hover:border-[#63F7D4]/45 hover:text-[#F6F8FB]">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-3 left-3 right-3 z-50 flex items-center gap-2 rounded-full border border-[#63F7D4]/30 bg-[#10141C]/95 px-4 py-3 text-sm font-bold text-[#F6F8FB] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          <ShieldCheck className="h-4 w-4 text-[#63F7D4]" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

createRoot(document.getElementById('popup-root')!).render(
  <StrictMode>
    <PopupApp />
  </StrictMode>,
)
