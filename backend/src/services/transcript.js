import { YoutubeTranscript } from 'youtube-transcript'
import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Fetch a YouTube video transcript via youtube-transcript.
 * Throws if the video has no captions.
 */
export async function getYouTubeTranscript(url) {
  const videoId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]
  if (!videoId) throw new Error('Invalid YouTube URL — could not find video ID')
  const segments = await YoutubeTranscript.fetchTranscript(videoId)
  return segments.map(s => s.text).join(' ')
}

/**
 * Transcribe a local video/audio file with OpenAI Whisper.
 */
export async function transcribeFile(filePath) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
    response_format: 'text',
  })
  return transcription
}

/**
 * TikTok / Instagram — no public transcript API.
 * Returns the user-supplied hint so the extractor can still infer the recipe.
 * TODO: replace stub with a RapidAPI scraper call.
 */
export async function getSocialTranscript(_url, hint = '') {
  return hint
}

/**
 * Auto-detect platform and fetch the best available transcript.
 */
export async function getTranscript(url, hint = '') {
  if (url.includes('youtube') || url.includes('youtu.be')) {
    return getYouTubeTranscript(url).catch(() => hint)
  }
  if (url.includes('tiktok') || url.includes('instagram')) {
    return getSocialTranscript(url, hint)
  }
  return hint
}
