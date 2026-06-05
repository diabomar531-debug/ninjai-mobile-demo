export const demoText = {
  title: 'The Future of AI Productivity in Education',
  eyebrow: 'Learning systems',
  intro:
    'Educators are moving from occasional AI experiments toward daily systems that support planning, feedback, research, and student reflection.',
  highlighted:
    'AI is becoming a continuous study companion rather than a standalone destination. Students increasingly need help while they read, write, research, and revise inside the tools they already use. The most useful systems will summarize dense passages, explain unfamiliar ideas, generate practice questions, and adapt support to the learner without forcing them to leave their workflow.',
  closing:
    'The next wave of productivity will be contextual, budget-aware, and available at the exact moment a learner needs it.',
}

export const demoInitialState = {
  walletBalance: 10,
  dailyLimit: 5,
  dailySpend: 0,
  mode: 'Smart',
  selectedProvider: null,
  selectedAction: null,
  taskCost: 0.0012,
}

export const demoAfterTask = {
  walletBalance: 9.9988,
  dailySpend: 0.0012,
  mode: 'Smart',
  selectedProvider: 'Claude',
  selectedAction: 'Summarize',
  taskCost: 0.0012,
  savings: '27%',
}

export const recentActivity = [
  { task: 'Summary', provider: 'Claude', mode: 'Smart', cost: 0.0012, time: 'Just now' },
  { task: 'Rewrite', provider: 'GPT', mode: 'Smart', cost: 0.0021, time: 'Yesterday' },
  { task: 'Explain', provider: 'Gemini', mode: 'Efficient', cost: 0.0008, time: 'Mon' },
]

export const summaryText =
  'This passage explains how AI is becoming a continuous study companion rather than a standalone app. It highlights the shift toward contextual learning support, where students can summarize, explain, and quiz themselves directly inside their workflow.'

export const quickActions = ['Summarize', 'Explain', 'Rewrite', 'Translate', 'Quiz Me', 'Ask Anything'] as const

export type QuickAction = (typeof quickActions)[number]
