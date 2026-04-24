import { useState } from 'react'
import ExtractBar from '../components/ExtractBar'
import RecipeGrid from '../components/RecipeGrid'
import RecipeCard from '../components/RecipeCard'
import { useRecipes } from '../hooks/useRecipes'

export default function Home() {
  const { recipes, extracting, error, setError, addRecipe, remove } = useRecipes()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleExtract = async (opts) => {
    setError(null)
    try {
      const recipe = await addRecipe(opts)
      setSuccessMsg(`"${recipe.title}" saved!`)
      setTimeout(() => setSuccessMsg(''), 3500)
    } catch { /* error set by hook */ }
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header minimal />
        <RecipeCard recipe={selected} onBack={() => setSelected(null)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <ExtractBar onExtract={handleExtract} extracting={extracting} />

      {/* Status messages */}
      {(error || successMsg) && (
        <div className="max-w-3xl mx-auto px-4 pt-3">
          {error && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
              <span>⚠ {error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">✕</button>
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
              ✓ {successMsg}
            </div>
          )}
        </div>
      )}

      {/* Collection */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your collection</h2>
            <p className="text-sm text-slate-400">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, tag, cuisine…"
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors w-52"
          />
        </div>
        <RecipeGrid
          recipes={recipes}
          onSelect={setSelected}
          onDelete={remove}
          search={search}
        />
      </main>
    </div>
  )
}

function Header({ minimal }) {
  return (
    <header className="bg-slate-900 px-4 py-5">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <span className="text-2xl">🎬</span>
        <div>
          <h1 className="text-white font-extrabold text-xl tracking-tight leading-none">
            ReelRecipes
          </h1>
          {!minimal && (
            <p className="text-slate-500 text-xs mt-0.5">Extract recipes from any cooking video</p>
          )}
        </div>
        <span className="ml-2 bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
          BETA
        </span>
      </div>
    </header>
  )
}
