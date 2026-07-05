"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/ui/Logo"
import { Heading } from "@/components/ui/Heading"
import { TextField } from "@/components/ui/TextField"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push("/teste")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5">
        <Logo />

        <div className="space-y-1">
          <Heading as="h3">Bem-vindo de volta</Heading>
          <p className="text-p1 text-neutral-500 text-center">Entre com seus dados para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 pt-4">
          <TextField label="Endereço de email" type="email" value={email} onChange={setEmail} placeholder="lucas@gmail.com" required />
          <TextField label="Senha" type="password" value={password} onChange={setPassword} placeholder="••••••••••••" required />

          <div className="text-right -pt-1">
            <Link href="/recuperar-senha" className="text-label text-neutral-500">
              Esqueceu sua senha?
            </Link>
          </div>

          {error && <p className="text-p1 text-red">{error}</p>}

          <Button className="mt-5" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Login →"}
          </Button>
        </form>

        <p className="text-center text-p1 text-neutral-500">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-green font-bold underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}