const TASK_COST = 0.0012
const SUMMARY_TEXT =
  'This passage explains how AI is becoming a continuous study companion rather than a standalone app. It highlights the shift toward contextual learning support, where students can summarize, explain, and quiz themselves directly inside their workflow.'

type FlowState = 'idle' | 'panel' | 'routing' | 'streaming' | 'complete'

let root: HTMLDivElement | null = null
let selectedText = ''
let selectionRect: DOMRect | null = null
let flowState: FlowState = 'idle'
let selectedAction = 'Summarize'
let walletBalance = 10
let suppressSelectionCleanupUntil = 0

const actions = ['Summarize', 'Explain', 'Rewrite', 'Translate', 'Quiz Me', 'Ask Anything']

init()

function init() {
  document.addEventListener('selectionchange', debounce(handleSelectionChange, 90))
  document.addEventListener('mouseup', () => window.setTimeout(handleSelectionChange, 20))
  chrome.runtime.sendMessage({ type: 'NINJAI_GET_WALLET' }).then((state) => {
    const wallet = state as { walletBalance?: number }
    walletBalance = wallet.walletBalance ?? 10
  })
}

function handleSelectionChange() {
  if (Date.now() < suppressSelectionCleanupUntil) {
    return
  }

  const selection = window.getSelection()
  const text = selection?.toString().trim() ?? ''

  if (!selection || text.length < 16 || selection.rangeCount === 0) {
    if (flowState === 'idle' && !root?.matches(':hover')) {
      cleanup()
    }
    return
  }

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  if (!rect.width || !rect.height) {
    return
  }

  selectedText = text
  selectionRect = rect
  flowState = 'idle'
  render()
}

function render() {
  if (!selectionRect) {
    return
  }

  if (!root) {
    root = document.createElement('div')
    root.id = 'ninjai-extension-root'
    document.documentElement.appendChild(root)
  }

  const top = Math.max(12, selectionRect.top + window.scrollY - 52)
  const left = Math.min(window.scrollX + selectionRect.left + selectionRect.width - 142, window.scrollX + document.documentElement.clientWidth - 188)

  root.innerHTML = `
    <style>${styles()}</style>
    <div class="ninjai-layer">
      ${flowState === 'idle' ? askPill(top, left) : ''}
      ${flowState === 'panel' ? quickActionPanel(top, left) : ''}
      ${flowState === 'routing' ? routingPanel(selectionRect.bottom + window.scrollY + 18, selectionRect.left + window.scrollX) : ''}
      ${flowState === 'streaming' || flowState === 'complete' ? responseCard(selectionRect.bottom + window.scrollY + 18, selectionRect.left + window.scrollX) : ''}
      ${flowState === 'complete' ? toast() : ''}
    </div>
  `

  root.addEventListener('mousedown', preservePageSelection, { capture: true })
  root.addEventListener('pointerdown', preservePageSelection, { capture: true })
  bindEvents()
}

function askPill(top: number, left: number) {
  return `
    <button class="ninjai-pill" style="top:${top}px;left:${Math.max(12, left)}px" data-ninjai-open>
      <span>✦</span>
      Ask Ninjai
      <small>Use your AI wallet here</small>
    </button>
  `
}

function quickActionPanel(top: number, left: number) {
  return `
    <section class="ninjai-panel" style="top:${top}px;left:${Math.max(12, left - 176)}px">
      <div class="ninjai-panel-head">
        <div>
          <p>Selected text</p>
          <h2>Ask Ninjai</h2>
        </div>
        <button data-ninjai-close>×</button>
      </div>
      <div class="ninjai-selected-preview">${escapeHtml(selectedText.slice(0, 124))}${selectedText.length > 124 ? '…' : ''}</div>
      <div class="ninjai-actions">
        ${actions
          .map(
            (action) => `
              <button class="${action === selectedAction ? 'active' : ''}" data-ninjai-action="${action}">
                <span>${actionIcon(action)}</span>
                ${action}
              </button>
            `,
          )
          .join('')}
      </div>
      <div class="ninjai-estimate">
        <div><small>Mode</small><strong>Smart</strong></div>
        <div><small>Estimated</small><strong>~$0.001</strong></div>
        <div><small>Wallet</small><strong>$${walletBalance.toFixed(walletBalance % 1 === 0 ? 2 : 4)}</strong></div>
      </div>
      <button class="ninjai-run" data-ninjai-run>Run with Ninjai</button>
    </section>
  `
}

function routingPanel(top: number, left: number) {
  return `
    <section class="ninjai-result" style="top:${top}px;left:${Math.max(12, left)}px">
      <div class="ninjai-route-step done">✓ <span>Analyzing task</span></div>
      <div class="ninjai-route-step done">✓ <span>Selecting best AI</span></div>
      <div class="ninjai-route-step active">✓ <span>Optimizing cost</span></div>
      <div class="ninjai-route-outcome">Smart Mode selected · Claude selected for balanced reasoning.</div>
    </section>
  `
}

function responseCard(top: number, left: number) {
  return `
    <section class="ninjai-result" style="top:${top}px;left:${Math.max(12, left)}px">
      <div class="ninjai-response-head">
        <h2>${selectedAction === 'Summarize' ? 'Summary' : selectedAction}</h2>
        ${
          flowState === 'complete'
            ? '<button class="ninjai-complete" data-ninjai-done>Complete</button>'
            : '<span>Streaming</span>'
        }
      </div>
      <p class="ninjai-response-copy">${flowState === 'complete' ? SUMMARY_TEXT : ''}<span class="ninjai-cursor"></span></p>
      <div class="ninjai-meta">Smart Mode · Claude · Cost $0.0012</div>
      <div class="ninjai-response-actions">
        <button>Copy</button><button>Save</button><button>Ask follow-up</button><button>Try Efficient</button>
      </div>
    </section>
  `
}

function toast() {
  return `<div class="ninjai-toast">✓ Task complete · $0.0012 deducted</div>`
}

function bindEvents() {
  root?.querySelector('[data-ninjai-open]')?.addEventListener('click', () => {
    suppressSelectionCleanupUntil = Date.now() + 600
    flowState = 'panel'
    render()
  })

  root?.querySelector('[data-ninjai-close]')?.addEventListener('click', () => {
    flowState = 'idle'
    render()
  })

  root?.querySelectorAll('[data-ninjai-action]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedAction = (button as HTMLElement).dataset.ninjaiAction ?? 'Summarize'
      render()
    })
  })

  root?.querySelector('[data-ninjai-run]')?.addEventListener('click', runTask)

  root?.querySelector('[data-ninjai-done]')?.addEventListener('click', () => {
    window.getSelection()?.removeAllRanges()
    flowState = 'idle'
    cleanup()
  })
}

function preservePageSelection(event: Event) {
  suppressSelectionCleanupUntil = Date.now() + 600
  event.stopPropagation()
  if (event.type === 'mousedown') {
    event.preventDefault()
  }
}

function runTask() {
  flowState = 'routing'
  render()

  window.setTimeout(() => {
    flowState = 'streaming'
    render()
    streamResponse()
  }, 1450)
}

function streamResponse() {
  const copy = root?.querySelector('.ninjai-response-copy')
  if (!copy) {
    return
  }

  let index = 0
  const interval = window.setInterval(() => {
    index += 4
    copy.textContent = SUMMARY_TEXT.slice(0, index)

    if (index >= SUMMARY_TEXT.length) {
      window.clearInterval(interval)
      chrome.runtime
        .sendMessage({
          type: 'NINJAI_TASK_COMPLETE',
          payload: { task: selectedAction === 'Summarize' ? 'Summary' : selectedAction, provider: 'Claude', mode: 'Smart', cost: TASK_COST },
        })
        .then((state) => {
          const wallet = state as { walletBalance?: number }
          walletBalance = wallet.walletBalance ?? Number((walletBalance - TASK_COST).toFixed(4))
          flowState = 'complete'
          render()
        })
    }
  }, 62)
}

function cleanup() {
  root?.remove()
  root = null
}

function actionIcon(action: string) {
  const map: Record<string, string> = {
    Summarize: '✦',
    Explain: '□',
    Rewrite: '✎',
    Translate: '文',
    'Quiz Me': '?',
    'Ask Anything': '↗',
  }
  return map[action] ?? '✦'
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function debounce(fn: () => void, delay: number) {
  let timer = 0
  return () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(fn, delay)
  }
}

function styles() {
  return `
    .ninjai-layer, .ninjai-layer * { box-sizing: border-box; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .ninjai-layer { position: absolute; inset: 0; z-index: 2147483647; pointer-events: none; color: #F6F8FB; }
    .ninjai-pill, .ninjai-panel, .ninjai-result, .ninjai-toast { pointer-events: auto; }
    .ninjai-pill { position: absolute; display: flex; align-items: center; gap: 8px; height: 38px; border-radius: 999px; border: 1px solid rgba(99,247,212,.35); background: rgba(16,20,28,.94); color: #F6F8FB; padding: 0 14px; font-size: 14px; font-weight: 750; box-shadow: 0 0 34px rgba(99,247,212,.22), 0 18px 50px rgba(0,0,0,.3); backdrop-filter: blur(18px); animation: ninjaiIn .18s ease-out; }
    .ninjai-pill span { color: #63F7D4; }
    .ninjai-pill small { position: absolute; left: 50%; top: 44px; transform: translateX(-50%); white-space: nowrap; border: 1px solid #273041; border-radius: 999px; background: #10141C; color: #A7B0C0; padding: 6px 10px; opacity: 0; transition: opacity .16s; }
    .ninjai-pill:hover small { opacity: 1; }
    .ninjai-panel { position: absolute; width: 340px; max-width: calc(100vw - 24px); border-radius: 24px; border: 1px solid #273041; background: rgba(16,20,28,.96); padding: 18px; box-shadow: 0 28px 90px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.08); backdrop-filter: blur(18px); animation: ninjaiPanel .26s cubic-bezier(.22,1,.36,1); }
    .ninjai-panel-head { display: flex; justify-content: space-between; gap: 16px; }
    .ninjai-panel-head p { margin: 0 0 8px; color: #63F7D4; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
    .ninjai-panel-head h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .ninjai-panel-head button { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #273041; background: transparent; color: #A7B0C0; font-size: 22px; }
    .ninjai-selected-preview { margin-top: 12px; border: 1px solid rgba(99,247,212,.18); background: rgba(99,247,212,.07); border-radius: 16px; color: #A7B0C0; padding: 10px 12px; font-size: 12px; line-height: 1.55; }
    .ninjai-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
    .ninjai-actions button { height: 66px; border-radius: 18px; border: 1px solid #273041; background: rgba(255,255,255,.035); color: #F6F8FB; text-align: left; padding: 12px; font-size: 14px; font-weight: 700; }
    .ninjai-actions button span { display: block; color: #63F7D4; margin-bottom: 6px; }
    .ninjai-actions button.active { border-color: rgba(99,247,212,.55); background: rgba(99,247,212,.12); }
    .ninjai-estimate { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 16px; padding: 14px; border-radius: 18px; border: 1px solid #273041; background: #171C26; }
    .ninjai-estimate small { display:block; color:#697386; font-size: 12px; margin-bottom: 5px; }
    .ninjai-estimate strong { font-size: 14px; color:#F6F8FB; }
    .ninjai-run { width: 100%; height: 48px; margin-top: 14px; border: 0; border-radius: 18px; background: #63F7D4; color: #06100D; font-weight: 850; box-shadow: 0 16px 36px rgba(99,247,212,.18); }
    .ninjai-result { position: absolute; width: 520px; max-width: calc(100vw - 24px); border-radius: 22px; border: 1px solid #273041; background: #10141C; padding: 18px; box-shadow: 0 24px 70px rgba(7,10,15,.28); animation: ninjaiPanel .26s cubic-bezier(.22,1,.36,1); }
    .ninjai-route-step { display:flex; align-items:center; gap: 12px; margin-bottom: 12px; color:#A7B0C0; font-weight: 700; font-size: 14px; }
    .ninjai-route-step::first-letter { color:#06100D; }
    .ninjai-route-step.done, .ninjai-route-step.active { color:#F6F8FB; }
    .ninjai-route-outcome { margin-top: 14px; border: 1px solid rgba(79,124,255,.3); background: rgba(79,124,255,.1); border-radius: 18px; color:#DDE6FF; padding: 12px; font-size: 14px; }
    .ninjai-response-head { display:flex; justify-content:space-between; align-items:center; gap:16px; }
    .ninjai-response-head h2 { margin:0; font-size:16px; font-weight:800; }
    .ninjai-response-head span, .ninjai-complete { border:1px solid rgba(99,247,212,.3); background:rgba(99,247,212,.1); color:#63F7D4; border-radius:999px; padding:5px 10px; font-size:12px; font-weight:800; }
    .ninjai-complete { cursor: pointer; transition: border-color .16s, background .16s; }
    .ninjai-complete:hover { border-color: rgba(99,247,212,.65); background: rgba(99,247,212,.18); }
    .ninjai-response-copy { min-height: 108px; margin: 16px 0; color:#DCE3EE; font-size:14px; line-height:1.75; }
    .ninjai-cursor { display:inline-block; width:4px; height:16px; margin-left:4px; background:#63F7D4; border-radius:99px; animation:ninjaiBlink 1s infinite; transform: translateY(3px); }
    .ninjai-meta { border-top:1px solid #273041; padding-top:12px; color:#697386; font-size:12px; font-weight:700; }
    .ninjai-response-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    .ninjai-response-actions button { border:1px solid #273041; background:rgba(255,255,255,.04); color:#A7B0C0; border-radius:999px; padding:7px 10px; font-size:12px; font-weight:700; }
    .ninjai-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); border:1px solid rgba(99,247,212,.3); background:rgba(16,20,28,.96); color:#F6F8FB; border-radius:999px; padding:12px 18px; font-size:14px; font-weight:800; box-shadow:0 20px 70px rgba(0,0,0,.45), 0 0 34px rgba(99,247,212,.16); animation:ninjaiToast .3s ease-out; }
    @keyframes ninjaiIn { from { opacity:0; transform: scale(.92) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
    @keyframes ninjaiPanel { from { opacity:0; transform: translateY(14px) scale(.98); } to { opacity:1; transform: translateY(0) scale(1); } }
    @keyframes ninjaiToast { from { opacity:0; transform: translate(-50%, 16px); } to { opacity:1; transform: translate(-50%, 0); } }
    @keyframes ninjaiBlink { 0%,100% { opacity:0; } 50% { opacity:1; } }
  `
}
