'use client'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/Toast'

type CartItem = { id: number; name: string; price: number; slug: string; img?: string }

export function AddToCartButton({ item }: { item: CartItem }) {
  const add = useCart((s) => s.add)
  const { show } = useToast()         // <- extrae la función del contexto

  return (
    <button
      onClick={() => {
        add({ ...item, qty: 1 })      // asegúrate de pasar qty
        show({
          title: 'Agregado al carrito ✅',
          desc: item.name,
        })
      }}
      className="px-4 py-2 rounded-lg bg-black text-white"
    >
      Agregar al carrito
    </button>
  )
}




