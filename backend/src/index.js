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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`✅  ReelRecipes API → http://localhost:${PORT}`))
