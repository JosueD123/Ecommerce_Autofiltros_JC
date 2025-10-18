'use client'
import { useState } from 'react'

type Tab = { key: string; label: string; content: React.ReactNode }

export default function Tabs({ items, initial = 'desc' }: { items: Tab[]; initial?: string }) {
  const [active, setActive] = useState(initial)
  return (
    <div>
      <div className="flex gap-2 border-b">
        {items.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-2 text-sm border-b-2 -mb-[2px] ${
              active === t.key ? 'border-black font-medium' : 'border-transparent text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-3">
        {items.find(t => t.key === active)?.content}
      </div>
    </div>
  )
}
