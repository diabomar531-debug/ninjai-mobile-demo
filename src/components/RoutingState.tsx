import { motion } from 'framer-motion'
import { Brain, Check, Gauge, Route } from 'lucide-react'

const steps = [
  { label: 'Analyzing task', icon: Brain },
  { label: 'Selecting best AI', icon: Route },
  { label: 'Optimizing cost', icon: Gauge },
]

export function RoutingState({ step }: { step: number }) {
  return (
    <div className="rounded-[22px] border border-[#273041] bg-[#10141C] p-4 text-[#F6F8FB] shadow-[0_22px_60px_rgba(7,10,15,0.18)]">
      <div className="space-y-3">
        {steps.map((item, index) => {
          const Icon = item.icon
          const active = step > index
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0.45, x: -6 }}
              animate={{ opacity: active ? 1 : 0.5, x: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-3"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-[#63F7D4] text-[#06100D]' : 'bg-white/7 text-[#A7B0C0]'}`}>
                {active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          )
        })}
      </div>
      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-[18px] border border-[#4F7CFF]/30 bg-[#4F7CFF]/10 p-3 text-sm text-[#DDE6FF]"
        >
          Smart Mode selected · Claude selected for balanced reasoning.
        </motion.div>
      )}
    </div>
  )
}
