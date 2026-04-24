const PLATFORMS = {
  youtube:   { bg: '#ff0000', label: 'YT' },
  tiktok:    { bg: '#010101', label: 'TK' },
  instagram: { bg: '#C13584', label: 'IG' },
  upload:    { bg: '#6366f1', label: 'UP' },
}

export function detectPlatform(url = '') {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok')) return 'tiktok'
  if (url.includes('instagram')) return 'instagram'
  return 'upload'
}

export default function PlatformBadge({ platform }) {
  const p = PLATFORMS[platform] || PLATFORMS.upload
  return (
    <span
      className="inline-block text-white text-[10px] font-bold tracking-wide rounded px-1.5 py-0.5"
      style={{ background: p.bg }}
    >
      {p.label}
    </span>
  )
}
