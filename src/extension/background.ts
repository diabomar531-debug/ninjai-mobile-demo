import { completeTask, DEFAULT_WALLET_STATE, getWalletState, setWalletState } from './shared/wallet'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(DEFAULT_WALLET_STATE).then((state) => {
    chrome.storage.local.set({ ...DEFAULT_WALLET_STATE, ...state })
  })
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'NINJAI_GET_WALLET') {
    getWalletState().then(sendResponse)
    return true
  }

  if (message.type === 'NINJAI_TASK_COMPLETE') {
    getWalletState()
      .then((state) => {
        const nextState = completeTask(
          state,
          message.payload.task,
          message.payload.provider,
          message.payload.mode,
          message.payload.cost,
        )
        return setWalletState(nextState).then(() => nextState)
      })
      .then(sendResponse)
    return true
  }

  if (message.type === 'NINJAI_SET_MODE') {
    getWalletState()
      .then((state) => {
        const nextState = { ...state, mode: message.payload.mode as typeof state.mode }
        return setWalletState(nextState).then(() => nextState)
      })
      .then(sendResponse)
    return true
  }

  return false
})
