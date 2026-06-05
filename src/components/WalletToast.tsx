import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function WalletToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#63F7D4]/30 bg-[#10141C]/95 px-5 py-3 text-sm font-semibold text-[#F6F8FB] shadow-[0_20px_70px_rgba(0,0,0,0.45),0_0_34px_rgba(99,247,212,0.16)] backdrop-blur-xl"
        >
          <CheckCircle2 className="h-5 w-5 text-[#3DFF9F]" />
          Task complete · $0.0012 deducted
        </motion.div>
      )}
    </AnimatePresence>
  )
}
