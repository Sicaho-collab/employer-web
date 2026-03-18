import type { Gig } from '@/types/gig'
import { getGigDisplayConfig } from '@/utils/gigDisplay'

interface StageBadgeProps {
  gig: Gig
}

// StageBadge reads derived display state from the full Gig.
// Label, colour and background are all computed — never hard-coded at call sites.
export default function StageBadge({ gig }: StageBadgeProps) {
  const { label, color, bg } = getGigDisplayConfig(gig)

  return (
    <span style={{ ...styles.badge, background: bg, color }}>
      <span style={{ ...styles.dot, background: color }} />
      {label}
    </span>
  )
}

const styles: Record<string, React.CSSProperties> = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    flexShrink: 0,
  },
}
