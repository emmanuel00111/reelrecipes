import { useState } from 'react'
import PlatformBadge from './PlatformBadge'
import StepTimer from './StepTimer'

const TABS = ['ingredients', 'method', 'notes']

export default function RecipeCard({ recipe, onBack }) {
  const [tab, setTab] = useState('ingredients')
  const [checkedIng, setCheckedIng] = useState({})
  const [checkedStep, setCheckedStep] = useState({})

  // Supabase stores snake_case; local fallback uses camelCase
  const totalTime  = recipe.total_time  ?? recipe.totalTime
  const prepTime   = recipe.prep_time   ?? recipe.prepTime
  const cookTime   = recipe.cook_time   ?? recipe.cookTime
  const servings   = recipe.servings
  const ingredients= recipe.ingredients ?? []
  const steps      = recipe.steps ?? []

  const toggleIng  = i => setCheckedIng(p  => ({ ...p,  [i]: !p[i]  }))
  const toggleStep = i => setCheckedStep(p => ({ ...p,  [i]: !p[i]  }))

  const times = [
    prepTime  && { label: 'Prep',  value: prepTime },
    cookTime  && { label: 'Cook',  value: cookTime },
    totalTime && { label: 'Total', value: totalTime },
  ].filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-5">
        ← Back to collection
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <PlatformBadge platform={recipe.platform} />
            {recipe.cuisine && (
              <span className="text-xs text-slate-400 uppercase tracking-wider">{recipe.cuisine}</span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{recipe.title}</h1>
        </div>
        {servings && (
          <div className="text-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 shrink-0">
            <div className="text-xl font-bold text-slate-900">{servings}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">servings</div>
          </div>
        )}
      </div>

      {/* Time pills */}
      {times.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {times.map(({ label, value }) => (
            <div
              key={label}
              className={[
                'rounded-lg px-3 py-1.5 text-sm',
                label === 'Total'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600',
              ].join(' ')}
            >
              <span className="opacity-60 mr-1">{label}</span>
              <strong>{value}m</strong>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {recipe.tags.map(t => (
            <span key={t} className="bg-blue-50 text-blue-500 rounded-full px-2.5 py-0.5 text-xs">#{t}</span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-5 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px',
              tab === t
                ? 'text-slate-900 border-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-600',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Ingredients ── */}
      {tab === 'ingredients' && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => setCheckedIng({})} className="text-xs text-slate-400 hover:text-slate-600">
              Reset
            </button>
          </div>
          {ingredients.map((ing, i) => (
            <div
              key={i}
              onClick={() => toggleIng(i)}
              className={[
                'flex items-center gap-3 py-3 border-b border-slate-50 cursor-pointer transition-opacity',
                checkedIng[i] ? 'opacity-40' : '',
              ].join(' ')}
            >
              <div className={[
                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                checkedIng[i] ? 'bg-green-500 border-green-500' : 'border-slate-300',
              ].join(' ')}>
                {checkedIng[i] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span>
                <strong className="text-slate-900">
                  {[ing.amount, ing.unit].filter(Boolean).join(' ')}
                </strong>{' '}
                <span className="text-slate-600">{ing.name}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Method ── */}
      {tab === 'method' && (
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              onClick={() => toggleStep(i)}
              className={[
                'flex gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                checkedStep[i]
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-transparent hover:bg-slate-100',
              ].join(' ')}
            >
              <div className={[
                'w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white transition-colors',
                checkedStep[i] ? 'bg-green-500' : 'bg-slate-900',
              ].join(' ')}>
                {checkedStep[i] ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <p className={[
                  'text-sm leading-relaxed text-slate-700 mb-2',
                  checkedStep[i] ? 'line-through opacity-50' : '',
                ].join(' ')}>
                  {step.text}
                </p>
                {step.time && !checkedStep[i] && <StepTimer minutes={step.time} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Notes ── */}
      {tab === 'notes' && (
        <div className="space-y-5">
          {recipe.notes ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">💡 Creator's tip</div>
              <p className="text-amber-900 text-sm leading-relaxed">{recipe.notes}</p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No notes extracted for this recipe.</p>
          )}
          {recipe.source_url && (
            <div>
              <div className="text-xs text-slate-400 mb-1">Source</div>
              <a
                href={recipe.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm break-all hover:underline"
              >
                {recipe.source_url}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
