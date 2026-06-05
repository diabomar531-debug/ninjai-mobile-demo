import { motion } from 'framer-motion'
import { Lightbulb, Zap } from 'lucide-react'

export function InsightCard({ efficient, onTryEfficient }: { efficient: boolean; onTryEfficient: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.32 }}
      className="rounded-[24px] border border-[#8A6CFF]/30 bg-[#8A6CFF]/10 p-5 shadow-[0_22px_60px_rgba(138,108,255,0.12)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#8A6CFF]/18 text-[#C9BDFF]">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F6F8FB]">Ninjai saved you 27% this week through smart routing.</h3>
          <p className="mt-2 text-sm leading-6 text-[#A7B0C0]">Summaries are usually cheaper in Efficient mode.</p>
          <button
            onClick={onTryEfficient}
            className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
              efficient ? 'border-[#3DFF9F]/35 bg-[#3DFF9F]/12 text-[#3DFF9F]' : 'border-[#8A6CFF]/35 bg-[#8A6CFF]/16 text-[#F6F8FB] hover:border-[#63F7D4]/45'
            }`}
          >
            <Zap className="h-4 w-4" />
            {efficient ? 'Efficient queued' : 'Try Efficient next time'}
          </button>
        </div>
      </div>
    </motion.section>
  )
}
