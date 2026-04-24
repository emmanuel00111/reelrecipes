import { useTimer } from '../hooks/useTimer'

export default function StepTimer({ minutes }) {
  const { running, display, done, start, stop } = useTimer(minutes)

  return (
    <button
      onClick={running ? stop : start}
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono transition-all',
        done    ? 'bg-green-100 border border-green-300 text-green-800' :
        running ? 'bg-amber-100 border border-amber-300 text-amber-800' :
                  'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200',
      ].join(' ')}
    >
      {done ? '✓ Done' : running ? `⏹ ${display}` : `⏱ ${minutes}m`}
    </button>
  )
}
