'use client'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type Toast = {
  id: number
  title: string
  desc?: string
  actionLabel?: string
  onAction?: () => void
  duration?: number // ms
}

type Ctx = {
  show: (t: Omit<Toast, 'id'>) => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([])

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now()
    const item: Toast = { id, duration: 2800, ...t }
    setList((L) => [...L, item])
    const d = item.duration ?? 2800
    if (d > 0) setTimeout(() => setList((L) => L.filter(x => x.id !== id)), d)
  }, [])

  const ctx = useMemo<Ctx>(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={ctx}>
      {children}

      {/* contenedor flotante */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {list.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto w-80 max-w-[90vw] rounded-xl border bg-white/95 shadow-lg backdrop-blur p-3"
          >
            <div className="font-medium">{t.title}</div>
            {t.desc && <div className="text-sm text-gray-600 mt-0.5">{t.desc}</div>}
            {t.actionLabel && (
              <button
                onClick={() => { t.onAction?.() }}
                className="mt-2 text-sm underline underline-offset-2"
              >
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
