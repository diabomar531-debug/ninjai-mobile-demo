import { AnimatePresence, motion } from 'framer-motion'
import { demoText } from '../data/demoData'
import { AskPill } from './AskPill'
import { HighlightButton } from './HighlightButton'
import { RoutingState } from './RoutingState'
import { StreamingResponse } from './StreamingResponse'
import type { DemoPhase } from '../state/demoStore'

export function ArticlePage({
  phase,
  routingStep,
  streamProgress,
  selectedAction,
  onHighlight,
  onAsk,
}: {
  phase: DemoPhase
  routingStep: number
  streamProgress: number
  selectedAction: string
  onHighlight: () => void
  onAsk: () => void
}) {
  const highlighted = phase !== 'idle'
  const showAskPill = phase === 'highlighted'
  const showRouting = phase === 'routing'
  const showResponse = phase === 'response' || phase === 'complete'

  return (
    <article className="relative min-h-[690px] rounded-b-[24px] bg-[#F6F8FB] px-5 py-7 text-[#172033] sm:px-10 sm:py-9">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#697386]">{demoText.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.02em] text-[#111827] sm:text-4xl">{demoText.title}</h1>
        </div>
        <HighlightButton highlighted={highlighted} onClick={onHighlight} />
      </div>

      <div className="max-w-3xl space-y-5 text-[16px] leading-8 text-[#344054]">
        <p>{demoText.intro}</p>
        <motion.p
          className={`relative rounded-[18px] border px-4 py-3 transition ${
            highlighted ? 'border-[#63F7D4]/35 bg-[#63F7D4]/22 shadow-[0_18px_45px_rgba(99,247,212,0.18)]' : 'border-transparent bg-transparent'
          }`}
          animate={highlighted ? { backgroundColor: 'rgba(99,247,212,0.22)' } : { backgroundColor: 'rgba(99,247,212,0)' }}
          transition={{ duration: 0.35 }}
        >
          {demoText.highlighted}
        </motion.p>
        <p>{demoText.closing}</p>
      </div>

      <AnimatePresence>{showAskPill && <AskPill onClick={onAsk} />}</AnimatePresence>

      <AnimatePresence>
        {showRouting && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-6 max-w-xl"
          >
            <RoutingState step={routingStep} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResponse && (
          <StreamingResponse selectedAction={selectedAction} streamProgress={streamProgress} complete={phase === 'complete'} />
        )}
      </AnimatePresence>
    </article>
  )
}
