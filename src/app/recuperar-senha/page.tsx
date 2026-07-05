"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Heading } from "@/components/ui/Heading"
import { TextField } from "@/components/ui/TextField"
import { Button } from "@/components/ui/Button"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* imagem: sempre 1/3 da altura da tela */}
      <div className="relative flex-[2] w-full">
        <Image src="/cadastro-hero.png" alt="" fill className="object-cover" priority />
      </div>

      {/* card: sempre 2/3 da altura da tela, puxado pra cima */}
      <div className="relative -mt-6 flex-[2] rounded-t-3xl bg-neutral-800 px-6 pt-6 pb-8 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="pt-5 space-y-1 text-center">
            <Heading as="h3">Recuperar Senha</Heading>
            <p className="text-p1 text-neutral-500 px-4">
              Digite seu email para receber o link de recuperação de senha.
            </p>
          </div>

          {sent ? (
          <p className="text-p2 text-neutral-100">
            Link enviado! Verifique sua caixa de entrada.
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <TextField label="Endereço de email" type="email" value={email} onChange={setEmail} placeholder="lucas@gmail.com" required />
            {error && <p className="text-p1 text-red">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação →"}
            </Button>
          </form>
        )}

          <p className="text-center text-p1 text-neutral-500">          
            <Link href="/login" className="text-green font-bold underline">
              Voltar para o login
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  )
}