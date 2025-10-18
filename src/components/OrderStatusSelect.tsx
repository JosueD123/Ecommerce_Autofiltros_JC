'use client'
import { useState } from 'react'

type Props = {
  orderId: number
  value: 'PENDING' | 'PAID' | 'CANCELLED'
  onChanged?: (v: Props['value']) => void
}

export default function OrderStatusSelect({ orderId, value, onChanged }: Props) {
  const [v, setV] = useState(value)
  const [loading, setLoading] = useState(false)

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Props['value']
    setV(next)
    setLoading(true)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
      credentials: 'include',
    })
    setLoading(false)
    if (!res.ok) {
      alert('No se pudo actualizar el estado')
      setV(value)
    } else {
      onChanged?.(next)
    }
  }

  return (
    <select
      value={v}
      disabled={loading}
      onChange={onChange}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  )
}
