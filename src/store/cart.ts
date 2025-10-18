'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Item = { id:number; name:string; price:number; qty:number; slug:string; img?:string }

type CartState = {
  items: Item[]
  add: (item: Item) => void
  remove: (id:number) => void
  clear: () => void
  setQty: (id:number, qty:number) => void      // ⬅️ nuevo
  inc: (id:number) => void                     // ⬅️ nuevo
  dec: (id:number) => void                     // ⬅️ nuevo
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const items = get().items
        const idx = items.findIndex(i => i.id === item.id)
        if (idx > -1) {
          const copy = [...items]
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty }
          set({ items: copy })
        } else {
          set({ items: [...items, item] })
        }
      },
      remove: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      clear: () => set({ items: [] }),

      // ====== NUEVO ======
      setQty: (id, qty) => {
        const q = Math.max(1, Math.floor(qty || 1))
        set({
          items: get().items.map(i => i.id === id ? { ...i, qty: q } : i)
        })
      },
      inc: (id) => {
        set({
          items: get().items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
        })
      },
      dec: (id) => {
        set({
          items: get().items.map(i => {
            if (i.id !== id) return i
            const q = Math.max(1, i.qty - 1)
            return { ...i, qty: q }
          })
        })
      },
    }),
    { name: 'autofiltros-cart' }
  )
)



