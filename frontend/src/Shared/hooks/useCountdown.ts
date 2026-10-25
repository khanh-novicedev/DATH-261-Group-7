import { useEffect, useState } from 'react'

function format(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return h > 0 ? `${h}:${mmss}` : mmss
}

export function useCountdown(endsAt: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!endsAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [endsAt])

  if (!endsAt) return { label: '--:--', ended: false, msLeft: Infinity }
  const msLeft = Math.max(0, new Date(endsAt).getTime() - now)
  return { label: format(msLeft), ended: msLeft === 0, msLeft }
}
