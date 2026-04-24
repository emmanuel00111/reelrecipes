import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import { getTranscript, transcribeFile } from '../services/transcript.js'
import { extractRecipe } from '../services/claude.js'
import { saveRecipe } from '../services/db.js'

export const extractRouter = Router()
const upload = multer({ dest: 'tmp/uploads/' })

/**
 * POST /api/extract
 * Body: { url, hint?, userId? }
 */
extractRouter.post('/', async (req, res) => {
  const { url, hint = '', userId } = req.body
  if (!url?.trim()) return res.status(400).json({ error: 'url is required' })

  try {
    const transcript = await getTranscript(url, hint)
    const recipe     = await extractRecipe(url, transcript, hint)
    let saved

    try {
      saved = await saveRecipe(recipe, url, userId)
    } catch {
      // If Supabase isn't configured, return the recipe without persisting
      saved = { ...recipe, id: Date.now().toString(), source_url: url, platform: 'upload', created_at: new Date().toISOString() }
    }

    res.json({ recipe: saved })
  } catch (err) {
    console.error('[extract]', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/extract/upload
 * Multipart: file (video/audio), hint?, userId?
 */
extractRouter.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path
  if (!filePath) return res.status(400).json({ error: 'No file uploaded' })

  const { hint = '', userId } = req.body

  try {
    const transcript = await transcribeFile(filePath)
    const label      = `[uploaded: ${req.file.originalname}]`
    const recipe     = await extractRecipe(label, transcript, hint)
    let saved

    try {
      saved = await saveRecipe(recipe, label, userId)
    } catch {
      saved = { ...recipe, id: Date.now().toString(), source_url: label, platform: 'upload', created_at: new Date().toISOString() }
    }

    res.json({ recipe: saved })
  } catch (err) {
    console.error('[extract/upload]', err)
    res.status(500).json({ error: err.message })
  } finally {
    fs.unlink(filePath, () => {})
  }
})
