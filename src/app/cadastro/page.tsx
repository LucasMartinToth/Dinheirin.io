"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Heading } from "@/components/ui/Heading"
import { TextField } from "@/components/ui/TextField"
import { Button } from "@/components/ui/Button"

export default function CadastroPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
        <p className="text-center max-w-sm text-p2 text-neutral-100">
          Conta criada! Verifique seu email para confirmar antes de entrar.
        </p>

        <p className="text-center text-p1 text-neutral-500">
          <Link href="/login" className="text-green font-bold">
            Voltar para o login
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* imagem: sempre 1/3 da altura da tela */}
      <div className="relative flex-[1] w-full">
        <Image src="/cadastro-hero.png" alt="" fill className="object-cover" priority />
      </div>

      {/* card: sempre 2/3 da altura da tela, puxado pra cima */}
      <div className="relative -mt-6 flex-[2] rounded-t-3xl bg-neutral-800 px-6 pt-6 pb-8 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="pt-5 space-y-1 text-center">
            <Heading as="h3">Cadastro</Heading>
            <p className="text-p1 text-neutral-500">
              Crie sua conta e comece a cuidar melhor de seu dinheir.io
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <TextField label="Endereço de email" type="email" value={email} onChange={setEmail} placeholder="lucas@gmail.com" required />
            <TextField label="Senha" type="password" value={password} onChange={setPassword} placeholder="••••••••••••" required />
            <TextField label="Confirmar Senha" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••••••" required />

            {error && <p className="text-p1 text-red">{error}</p>}

            <Button className="mt-5" type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta →"}
            </Button>
          </form>

          <p className="text-center text-p1 text-neutral-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-green font-bold">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}