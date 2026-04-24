import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM = `You are a precise recipe extraction AI. Given a cooking video URL and transcript, extract a complete structured recipe.
Return ONLY a JSON object — no markdown, no explanation, no code fences.`

const SCHEMA = {
  name: 'recipe',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'prepTime', 'cookTime', 'totalTime', 'servings', 'cuisine', 'tags', 'ingredients', 'steps', 'notes'],
    properties: {
      title: { type: 'string' },
      prepTime: { type: 'integer' },
      cookTime: { type: 'integer' },
      totalTime: { type: 'integer' },
      servings: { type: 'integer' },
      cuisine: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      ingredients: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['amount', 'unit', 'name'],
          properties: {
            amount: { type: 'string' },
            unit: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
      steps: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['text', 'time'],
          properties: {
            text: { type: 'string' },
            time: { type: ['integer', 'null'] },
          },
        },
      },
      notes: { type: 'string' },
    },
  },
}

/**
 * Extract a recipe from a video URL + transcript using OpenAI.
 * @param {string} url        - Original video URL
 * @param {string} transcript - Text transcript (may be empty)
 * @param {string} hint       - User-supplied description hint
 * @returns {object}          - Parsed recipe object
 */
export async function extractRecipe(url, transcript = '', hint = '') {
  const context = [transcript, hint].filter(Boolean).join('\n\n')

  const userMessage = `Video URL: ${url}
${context ? `\nTranscript / context:\n${context}` : ''}

Extract the full recipe and return it as a JSON object.

Rules:
- time values are integers (minutes); use null for steps with no wait time
- amounts are strings (e.g. "1/2", "200")
- tags are lowercase, useful for filtering (e.g. "30-min", "dairy-free", "vegetarian")
- notes = one concrete tip from the creator
- If no transcript is available, infer from the URL and cuisine context`

  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: [{ type: 'input_text', text: SYSTEM }] },
      { role: 'user', content: [{ type: 'input_text', text: userMessage }] },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: SCHEMA.name,
        schema: SCHEMA.schema,
        strict: true,
      },
    },
  })

  const outputText = response.output_text?.trim()
  if (!outputText) throw new Error('Model did not return recipe JSON')
  return JSON.parse(outputText)
}
