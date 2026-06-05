export type ActivityItem = {
  task: string
  provider: string
  mode: string
  cost: number
  time: string
}

export type WalletState = {
  walletBalance: number
  dailySpend: number
  dailyLimit: number
  mode: 'Smart' | 'Efficient' | 'Instant' | 'Deep'
  activity: ActivityItem[]
}

export const TASK_COST = 0.0012

export const DEFAULT_WALLET_STATE: WalletState = {
  walletBalance: 10,
  dailySpend: 0,
  dailyLimit: 5,
  mode: 'Smart',
  activity: [
    { task: 'Rewrite', provider: 'GPT', mode: 'Smart', cost: 0.0021, time: 'Yesterday' },
    { task: 'Explain', provider: 'Gemini', mode: 'Efficient', cost: 0.0008, time: 'Mon' },
  ],
}

export async function getWalletState() {
  return chrome.storage.local.get<WalletState>(DEFAULT_WALLET_STATE)
}

export async function setWalletState(state: WalletState) {
  await chrome.storage.local.set(state)
}

export function completeTask(state: WalletState, task: string, provider = 'Claude', mode = 'Smart', cost = TASK_COST): WalletState {
  return {
    ...state,
    walletBalance: Number((state.walletBalance - cost).toFixed(4)),
    dailySpend: Number((state.dailySpend + cost).toFixed(4)),
    mode: mode as WalletState['mode'],
    activity: [{ task, provider, mode, cost, time: 'Just now' }, ...state.activity].slice(0, 6),
  }
}
