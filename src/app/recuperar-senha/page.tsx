"use client"

import { useState } from "react"
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <Heading as="h2">Recuperar senha</Heading>
          <p className="text-p1 text-neutral-500">
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
      </div>
    </div>
  )
}