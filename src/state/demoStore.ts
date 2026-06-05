import { useEffect, useMemo, useState } from 'react'
import { demoAfterTask, demoInitialState, type QuickAction } from '../data/demoData'

export type DemoPhase = 'idle' | 'highlighted' | 'panel' | 'routing' | 'response' | 'complete'

export function useDemoStore() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [selectedAction, setSelectedAction] = useState<QuickAction>('Summarize')
  const [routingStep, setRoutingStep] = useState(0)
  const [streamProgress, setStreamProgress] = useState(0)
  const [popupOpen, setPopupOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [tryEfficient, setTryEfficient] = useState(false)

  const taskComplete = phase === 'complete'
  const walletBalance = taskComplete ? demoAfterTask.walletBalance : demoInitialState.walletBalance
  const dailySpend = taskComplete ? demoAfterTask.dailySpend : demoInitialState.dailySpend

  useEffect(() => {
    if (phase !== 'routing') {
      return
    }

    const timers = [450, 900, 1350, 1750].map((delay, index) =>
      window.setTimeout(() => {
        if (index < 3) {
          setRoutingStep(index + 1)
          return
        }
        setStreamProgress(0)
        setPhase('response')
      }, delay),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [phase])

  useEffect(() => {
    if (phase !== 'response') {
      return
    }

    const interval = window.setInterval(() => {
      setStreamProgress((value) => {
        if (value >= 100) {
          window.clearInterval(interval)
          window.setTimeout(() => {
            setPhase('complete')
            setToastVisible(true)
          }, 420)
          return 100
        }
        return value + 4
      })
    }, 90)

    return () => window.clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (!toastVisible) {
      return
    }

    const timer = window.setTimeout(() => setToastVisible(false), 3600)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  return useMemo(
    () => ({
      phase,
      selectedAction,
      routingStep,
      streamProgress,
      popupOpen,
      toastVisible,
      tryEfficient,
      walletBalance,
      dailySpend,
      highlightText: () => setPhase('highlighted'),
      openPanel: () => setPhase('panel'),
      closePanel: () => setPhase((current) => (current === 'panel' ? 'highlighted' : current)),
      chooseAction: (action: QuickAction) => setSelectedAction(action),
      runTask: () => {
        setRoutingStep(0)
        setPhase('routing')
      },
      openPopup: () => setPopupOpen(true),
      closePopup: () => setPopupOpen(false),
      tryEfficientNext: () => setTryEfficient(true),
      resetDemo: () => {
        setPhase('idle')
        setSelectedAction('Summarize')
        setRoutingStep(0)
        setStreamProgress(0)
        setPopupOpen(false)
        setToastVisible(false)
        setTryEfficient(false)
      },
    }),
    [dailySpend, phase, popupOpen, routingStep, selectedAction, streamProgress, toastVisible, tryEfficient, walletBalance],
  )
}
