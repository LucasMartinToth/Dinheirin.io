// src/app/casa/compartilhar/ContinuarButton.tsx
'use client'

import { useRouter } from 'next/navigation'

export function ContinuarButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/teste')}
      className="rounded-full bg-neutral-100 px-6 py-2 text-p2 text-green transition-opacity"
    >
      Continuar →
    </button>
  )
}