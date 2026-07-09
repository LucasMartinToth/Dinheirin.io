// src/app/casa/compartilhar/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Heading } from '@/components/ui/Heading'
import { ContinuarButton } from './ContinuarButton'

export default async function CompartilharCasaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('household_id')
    .eq('id', user!.id)
    .single()

  if (!profile?.household_id) {
    redirect('/casa')
  }

  const { data: household } = await supabase
    .from('households')
    .select('invite_code')
    .eq('id', profile.household_id)
    .single()

  const code = household?.invite_code ?? ''

  return (
    <main className="flex h-screen items-center justify-center bg-green-300 px-16">
    <div className="flex flex-col items-start gap-6">
      <Heading as="h2" className="!text-neutral-700 text-left">
        Casa criada!
      </Heading>

      <p className="text-p2 text-neutral-700">Veja abaixo seu código de Casa.</p>

      <div className="flex gap-2">
        {code.split('').map((char: string, index: number) => (
          <span
            key={index}
            className="flex h-14 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-h4 font-bold text-neutral-800"
          >
            {char}
          </span>
        ))}
      </div>

      <p className="text-p2 text-neutral-700">
        Compartilhe-o para que outros usuários entrem em sua Casa!
      </p>

      <ContinuarButton />
    </div>
    </main>
  )
}