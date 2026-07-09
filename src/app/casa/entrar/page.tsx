// src/app/casa/entrar/page.tsx
'use client'

import { useState, useRef, KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'

const CODE_LENGTH = 6
// Alfabeto seguro: A-Z sem O/I/L + dígitos sem 0/1
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const INVALID_CHARS = new RegExp(`[^${ALPHABET}]`, 'g')

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function EntrarCasaPage() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [status, setStatus] = useState<Status>('idle')
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const supabase = createClient()

  const focusInput = (index: number) => inputsRef.current[index]?.focus()

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(INVALID_CHARS, '').slice(-1)
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (status === 'error') setStatus('idle')

    if (value && index < CODE_LENGTH - 1) {
      focusInput(index + 1)
    }

    if (value && index === CODE_LENGTH - 1) {
      const fullCode = next.join('')
      if (fullCode.length === CODE_LENGTH) submitCode(fullCode)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(INVALID_CHARS, '').slice(0, CODE_LENGTH)

    if (!pasted) return

    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((char, i) => (next[i] = char))
    setDigits(next)

    if (pasted.length === CODE_LENGTH) {
      submitCode(pasted)
    } else {
      focusInput(pasted.length)
    }
  }

  const submitCode = async (code: string) => {
    setStatus('loading')

    const { error: rpcError } = await supabase.rpc('join_household', {
      p_invite_code: code,
    })

    if (rpcError) {
      setStatus('error')
      setDigits(Array(CODE_LENGTH).fill(''))
      focusInput(0)
      return
    }

    setStatus('success')
    setTimeout(() => {
      router.push('/teste') // trocar por /dashboard quando existir
    }, 1200)
  }

  if (status === 'success') {
    return (
      <main className="flex h-screen items-center justify-center bg-blue-200">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-14 w-14 text-neutral-700" />
          <Heading as="h2" className="!text-neutral-700">
            Entrou com sucesso!
          </Heading>
          <Loader2 className="h-6 w-6 animate-spin text-blue" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex h-screen items-center justify-center bg-blue-200">
      <div className="flex flex-col items-start gap-6">
        <Heading as="h2" className="!text-neutral-700 text-left">
          Já tenho
          <br />
          minha Casa
        </Heading>

        <div className="flex gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el
              }}
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={1}
              value={digit}
              disabled={status === 'loading'}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-14 w-12 rounded-2xl bg-neutral-100 text-center text-h4 font-bold text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-800 disabled:opacity-60"
            />
          ))}
        </div>

        <p className="text-p2 text-neutral-700">Digite seu código de Casa</p>

        {status === 'error' && (
          <p className="text-p2 font-bold text-red">Código inválido. Confira e tente novamente.</p>
        )}
      </div>
    </main>
  )
}