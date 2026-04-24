import { Router } from 'express'
import { supabase } from '../services/db.js'

export const recipesRouter = Router()

/**
 * GET /api/recipes?userId=xxx
 */
recipesRouter.get('/', async (req, res) => {
  const { userId } = req.query
  if (!userId) return res.status(400).json({ error: 'userId is required' })

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json({ recipes: data })
})

/**
 * GET /api/recipes/:id
 */
recipesRouter.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Recipe not found' })
  res.json({ recipe: data })
})

/**
 * PATCH /api/recipes/:id  — update title / tags / notes
 */
recipesRouter.patch('/:id', async (req, res) => {
  const allowed = ['title', 'cuisine', 'tags', 'notes', 'servings']
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  )

  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ recipe: data })
})

/**
 * DELETE /api/recipes/:id
 */
recipesRouter.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})
