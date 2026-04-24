import PlatformBadge from './PlatformBadge'

const EMOJIS = ['🍳','🥘','🍜','🥗','🍕','🥩','🍣','🥞','🍝','🍛','🥙','🍲']

function cardEmoji(title = '') {
  return EMOJIS[title.charCodeAt(0) % EMOJIS.length]
}

export default function RecipeGrid({ recipes, onSelect, onDelete, search }) {
  const filtered = recipes.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.title?.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q))
    )
  })

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        {search
          ? `No recipes matching "${search}"`
          : 'No recipes yet — paste a video link above to get started!'}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(recipe => (
        <div
          key={recipe.id}
          onClick={() => onSelect(recipe)}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-150"
        >
          {/* Colour header */}
          <div
            className="h-20 flex items-center justify-center text-3xl"
            style={{ background: `hsl(${(recipe.title?.charCodeAt(0) ?? 0) * 7 % 360}, 50%, 93%)` }}
          >
            {cardEmoji(recipe.title)}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <PlatformBadge platform={recipe.platform} />
              {recipe.cuisine && (
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">{recipe.cuisine}</span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 leading-snug mb-2">{recipe.title}</h3>

            <div className="flex gap-3 text-xs text-slate-400 mb-3">
              {recipe.total_time   && <span>⏱ {recipe.total_time}m</span>}
              {recipe.servings     && <span>🍽 {recipe.servings} servings</span>}
              {recipe.ingredients  && <span>📋 {recipe.ingredients.length} ingredients</span>}
            </div>

            {recipe.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.tags.slice(0, 4).map(t => (
                  <span key={t} className="bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2 flex justify-end">
            <button
              onClick={e => { e.stopPropagation(); onDelete(recipe.id) }}
              className="text-xs text-slate-300 hover:text-red-400 transition-colors px-1.5 py-1 rounded"
            >
              ✕ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
