import { useState, useEffect, useCallback } from 'react'
import { fetchRecipes, deleteRecipe, extractFromUrl, extractFromFile } from '../lib/api'

const STORAGE_KEY = 'reelrecipes_local_v1'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function saveLocal(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

export function useRecipes() {
  const [recipes, setRecipes] = useState(loadLocal)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState(null)

  // Sync to localStorage on every change
  useEffect(() => { saveLocal(recipes) }, [recipes])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchRecipes()
      setRecipes(data)
    } catch {
      // silently fall back to local if Supabase isn't configured
    } finally {
      setLoading(false)
    }
  }, [])

  const addRecipe = useCallback(async ({ url, file, hint }) => {
    setExtracting(true)
    setError(null)
    try {
      const recipe = url
        ? await extractFromUrl(url, hint)
        : await extractFromFile(file, hint)
      setRecipes(prev => [recipe, ...prev])
      return recipe
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setExtracting(false)
    }
  }, [])

  const remove = useCallback(async (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id))
    try { await deleteRecipe(id) } catch { /* best effort */ }
  }, [])

  return { recipes, loading, extracting, error, setError, addRecipe, remove, refresh }
}
