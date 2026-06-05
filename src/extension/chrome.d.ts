declare namespace chrome {
  namespace runtime {
    const onInstalled: {
      addListener(callback: () => void): void
    }
    const onMessage: {
      addListener(
        callback: (
          message: RuntimeMessage,
          sender: unknown,
          sendResponse: (response?: unknown) => void,
        ) => boolean | void,
      ): void
    }
    function sendMessage(message: RuntimeMessage): Promise<unknown>
  }

  namespace storage {
    const local: {
      get<T extends Record<string, unknown>>(defaults?: T): Promise<T>
      set(values: Record<string, unknown>): Promise<void>
    }
  }
}

type RuntimeMessage =
  | { type: 'NINJAI_GET_WALLET' }
  | { type: 'NINJAI_TASK_COMPLETE'; payload: { task: string; provider: string; mode: string; cost: number } }
  | { type: 'NINJAI_SET_MODE'; payload: { mode: string } }
