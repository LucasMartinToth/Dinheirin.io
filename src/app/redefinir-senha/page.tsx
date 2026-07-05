"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/ui/Logo"
import { Heading } from "@/components/ui/Heading"
import { TextField } from "@/components/ui/TextField"
import { Button } from "@/components/ui/Button"

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)

    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Logo />
          <p className="text-p2 text-neutral-100">
            Senha alterada com sucesso! Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <Logo />

        <div className="space-y-1">
          <Heading as="h2">Redefinir senha</Heading>
          <p className="text-p1 text-neutral-500 text-center">
            Digite sua nova senha para continuar.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <TextField label="Nova senha" type="password" value={password} onChange={setPassword} placeholder="••••••••••••" required />
          <TextField label="Confirmar nova senha" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••••••" required />

          {error && <p className="text-p1 text-red">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Mudar senha →"}
          </Button>
        </form>
      </div>
    </div>
  )
}