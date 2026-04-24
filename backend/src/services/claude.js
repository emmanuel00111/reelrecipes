import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are a precise recipe extraction AI. Given a cooking video URL and transcript, extract a complete structured recipe.
Return ONLY a JSON object — no markdown, no explanation, no code fences.`

const SCHEMA = `{
  "title": "string",
  "prepTime": number,
  "cookTime": number,
  "totalTime": number,
  "servings": number,
  "cuisine": "string",
  "tags": ["string"],
  "ingredients": [{ "amount": "string", "unit": "string", "name": "string" }],
  "steps": [{ "text": "string", "time": number | null }],
  "notes": "string"
}`

/**
 * Extract a recipe from a video URL + transcript using Claude.
 * @param {string} url        - Original video URL
 * @param {string} transcript - Text transcript (may be empty)
 * @param {string} hint       - User-supplied description hint
 * @returns {object}          - Parsed recipe object
 */
export async function extractRecipe(url, transcript = '', hint = '') {
  const context = [transcript, hint].filter(Boolean).join('\n\n')

  const userMessage = `Video URL: ${url}
${context ? `\nTranscript / context:\n${context}` : ''}

Extract the full recipe and return it as a JSON object matching this schema:
${SCHEMA}

Rules:
- time values are integers (minutes); use null for steps with no wait time
- amounts are strings (e.g. "1/2", "200")  
- tags are lowercase, useful for filtering (e.g. "30-min", "dairy-free", "vegetarian")
- notes = one concrete tip from the creator
- If no transcript is available, infer from the URL and cuisine context`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = message.content.map(b => b.text || '').join('')
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
