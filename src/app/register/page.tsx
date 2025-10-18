import { redirect } from 'next/navigation'

export default function RegisterRedirect() {
  // Si alguien navega a /register, lo enviamos a /login con la pestaña "Crear cuenta"
  redirect('/login?tab=register')
}


