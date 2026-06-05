import { Highlighter } from 'lucide-react'

export function HighlightButton({ highlighted, onClick }: { highlighted: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0 ${
        highlighted
          ? 'border-[#63F7D4]/45 bg-[#63F7D4]/12 text-[#63F7D4]'
          : 'border-[#273041] bg-[#10141C] text-[#F6F8FB] hover:border-[#63F7D4]/40'
      }`}
    >
      <Highlighter className="h-4 w-4" />
      {highlighted ? 'Text highlighted' : 'Highlight Text'}
    </button>
  )
}
