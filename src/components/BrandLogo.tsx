'use client'

import { useState } from 'react'

type Props = {
  name: string
  slug?: string | null
  className?: string
  boxClassName?: string
}

export default function BrandLogo({ name, slug, className, boxClassName }: Props) {
  const base =
    (slug || name)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  const candidates = [
    `/brands/${base}.png`,
    `/brands/${base}.jpg`,
    `/brands/${base}.jpeg`,
  ]

  const [i, setI] = useState(0)

  // si ya probamos todas las extensiones → mostramos fallback con iniciales
  if (i >= candidates.length) {
    const initials = name.slice(0, 2).toUpperCase()
    return (
      <div className={`w-14 h-14 rounded-xl border bg-gray-50 flex items-center justify-center ${boxClassName || ''}`}>
        <span className="text-xs font-medium text-gray-600">{initials}</span>
      </div>
    )
  }

  return (
    <div className={`w-14 h-14 rounded-xl border bg-white overflow-hidden flex items-center justify-center ${boxClassName || ''}`}>
      <img
        src={candidates[i]}
        alt={name}
        className={className || 'max-w-full max-h-full object-contain'}
        onError={() => setI(i + 1)}
      />
    </div>
  )
}
