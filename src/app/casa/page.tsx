// src/app/casa/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Heading } from '@/components/ui/Heading'
import Image from "next/image"

export default async function CasaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('household_id')
    .eq('id', user!.id)
    .single()

  if (profile?.household_id) {
    redirect('/teste') // trocar por /dashboard quando existir
  }

  return (
    <main className="flex h-screen flex-col">
      {/* Metade de cima — já tem uma casa */}
      <Link
        href="/casa/entrar"
        className="flex flex-1 flex-col items-left justify-end gap-3 bg-blue-200 px-16 pb-16 text-center transition-opacity active:opacity-90"
      >
        <div className="flex items-left">
              <Image src="/home.svg" alt="" width={120} height={32} />
        </div>

        <Heading as="h2" className="!text-neutral-700 text-left mt-2">
          Já tenho
          <br />
          minha Casa
        </Heading>

        <p className="rounded-full bg-neutral-100 py-2 text-p2 text-blue w-38 mt-2">
          Acessar Casa
        </p>

      </Link>

      {/* Metade de baixo — ainda não tem casa */}
      <Link
        href="/casa/criar"
        className="flex flex-1 flex-col items-left justify-top gap-3 bg-green-300 px-16 pt-16 text-center transition-opacity active:opacity-90"
      >

        <Heading as="h2" className="!text-neutral-700 text-left mt-2">
          Ainda não criei
          <br />
          minha Casa
        </Heading>

        <p className="rounded-full bg-neutral-100 py-2 text-p2 text-green w-38 mb-2">
          Cadastrar Casa
        </p>
        
        <div className="flex items-left">
        <Image src="/create-home.svg" alt="" width={120} height={32} />
        </div>

      </Link>
    </main>
  )
}