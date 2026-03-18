import { PaymentStatus } from '@/types/gig'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

// Only renders for non-NOT_REQUIRED statuses — no badge means no payment action yet
const STATUS_CONFIG: Partial<Record<PaymentStatus, { label: string; color: string; bg: string }>> = {
  [PaymentStatus.AUTHORISED]: { label: 'Authorised', color: '#1E40AF', bg: '#DBEAFE' },
  [PaymentStatus.CAPTURED]:   { label: 'Captured',   color: '#065F46', bg: '#D1FAE5' },
  [PaymentStatus.FAILED]:     { label: 'Failed',     color: '#7F1D1D', bg: '#FEE2E2' },
  [PaymentStatus.REFUNDED]:   { label: 'Refunded',   color: '#92400E', bg: '#FEF3C7' },
  [PaymentStatus.DISPUTED]:   { label: 'Disputed',   color: '#6B21A8', bg: '#F3E8FF' },
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  if (!config) return null  // NOT_REQUIRED = no badge

  return (
    <span style={{ ...styles.badge, background: config.bg, color: config.color }}>
      <span style={styles.prefix}>Payment</span>
      <span style={{ ...styles.divider, background: config.color }} />
      {config.label}
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
    whiteSpace: 'nowrap',
  },
  prefix: {
    opacity: 0.65,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  divider: {
    width: 1,
    height: 10,
    opacity: 0.35,
    borderRadius: 1,
  },
}
