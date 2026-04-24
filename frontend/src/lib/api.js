import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const API = import.meta.env.VITE_API_URL || '/api'

export async function extractFromUrl(url, hint = '') {
  const res = await fetch(`${API}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, hint }),
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Extraction failed')
  return (await res.json()).recipe
}

export async function extractFromFile(file, hint = '') {
  const form = new FormData()
  form.append('file', file)
  form.append('hint', hint)
  const res = await fetch(`${API}/extract/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error((await res.json()).error || 'Extraction failed')
  return (await res.json()).recipe
}

export async function fetchRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteRecipe(id) {
  const { error } = await supabase.from('recipes').delete().eq('id', id)
  if (error) throw error
}
