import type { LucideIcon } from 'lucide-react'

export function ActionButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-16 flex-col items-start justify-between rounded-[18px] border p-3 text-left transition hover:-translate-y-0.5 hover:border-[#63F7D4]/50 active:translate-y-0 ${
        active ? 'border-[#63F7D4]/55 bg-[#63F7D4]/12' : 'border-[#273041] bg-white/[0.035]'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-[#63F7D4]' : 'text-[#A7B0C0]'}`} />
      <span className="text-sm font-medium text-[#F6F8FB]">{label}</span>
    </button>
  )
}
