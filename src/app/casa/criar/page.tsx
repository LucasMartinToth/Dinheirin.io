// src/app/casa/criar/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'

export default function CriarCasaPage() {
  const [nome, setNome] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const trimmed = nome.trim()
    if (!trimmed) return

    setStatus('loading')

    const { error } = await supabase.rpc('create_household', {
      p_name: trimmed,
    })

    if (error) {
      setStatus('error')
      return
    }

    router.push('/casa/compartilhar')
  }

  return (
    <main className="flex h-screen items-center justify-center bg-green-300">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-6 w-72"
      >
        <Heading as="h2" className="!text-neutral-700 text-left">
          Ainda não criei
          <br />
          minha Casa
        </Heading>

        <div className="flex w-full flex-col gap-2">
          <label htmlFor="nome-casa" className="text-p2 text-neutral-700">
            Dê um nome à sua Casa
          </label>
          <input
            id="nome-casa"
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            placeholder="Nossa casa"
            disabled={status === 'loading'}
            maxLength={40}
            className="w-full rounded-2xl bg-neutral-100 px-4 py-3 text-p1 text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-800 disabled:opacity-60"
          />
        </div>

        {status === 'error' && (
          <p className="text-p2 text-red">
            Não foi possível criar a Casa. Tente de novo.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !nome.trim()}
          className="rounded-full bg-neutral-100 px-6 py-2 text-p2 text-green transition-opacity"
        >
          {status === 'loading' ? 'Criando...' : 'Criar Casa →'}
        </button>
      </form>
    </main>
  )
}