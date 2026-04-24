import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

function detectPlatform(url = '') {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok')) return 'tiktok'
  if (url.includes('instagram')) return 'instagram'
  return 'upload'
}

/**
 * Persist an extracted recipe to Supabase.
 */
export async function saveRecipe(recipe, sourceUrl, userId) {
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      user_id:    userId ?? null,
      source_url: sourceUrl,
      platform:   detectPlatform(sourceUrl),
      title:      recipe.title,
      prep_time:  recipe.prepTime,
      cook_time:  recipe.cookTime,
      total_time: recipe.totalTime,
      servings:   recipe.servings,
      cuisine:    recipe.cuisine,
      tags:       recipe.tags       ?? [],
      ingredients:recipe.ingredients ?? [],
      steps:      recipe.steps       ?? [],
      notes:      recipe.notes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
