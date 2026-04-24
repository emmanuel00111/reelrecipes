import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { extractRouter } from './routes/extract.js'
import { recipesRouter } from './routes/recipes.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/extract', extractRouter)
app.use('/api/recipes', recipesRouter)

app.get('/api/health', (_, res) => res.json({ ok: true }))

app.get('/', (_, res) => res.json({
  name: 'ReelRecipes API',
  version: '0.1.0',
  endpoints: {
    health:  'GET  /api/health',
    extract: 'POST /api/extract',
    upload:  'POST /api/extract/upload',
    recipes: 'GET  /api/recipes?userId=<id>',
    recipe:  'GET  /api/recipes/:id',
  },
}))

app.use((_, res) => res.status(404).json({ error: 'Not found' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`✅  ReelRecipes API → http://localhost:${PORT}`))
