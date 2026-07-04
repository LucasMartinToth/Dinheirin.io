import { createClient } from '@/lib/supabase/server'

export default async function TestePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('households').select('*')

  return (
    <pre>
      {error ? `Erro: ${error.message}` : JSON.stringify(data, null, 2)}
    </pre>
  )
}