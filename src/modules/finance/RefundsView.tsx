// Refunds View — all refunds linked to a Gig.
import type { Refund } from '@/types/gig'
import { useNavigate } from 'react-router-dom'

const STATUS_STYLE: Record<Refund['status'], React.CSSProperties> = {
  REQUESTED: { color: '#92400E', background: '#FEF3C7' },
  APPROVED:  { color: '#1E40AF', background: '#DBEAFE' },
  PROCESSED: { color: '#065F46', background: '#D1FAE5' },
}

// Placeholder data
const REFUNDS: (Refund & { gigTitle: string })[] = [
  { id: 'r1', gig_id: 'g1', transaction_id: 't3', gigTitle: 'Frontend Developer', amount: 600, reason: 'Partial gig cancellation', status: 'PROCESSED', created_at: '2025-01-28T00:00:00Z' },
]

export default function RefundsView() {
  const navigate = useNavigate()

  if (REFUNDS.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No refunds to display.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['ID', 'Linked Gig', 'Transaction', 'Amount', 'Reason', 'Status', 'Date'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REFUNDS.map((r) => (
            <tr key={r.id} style={styles.tr}>
              <td style={{ ...styles.td, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{r.id}</td>
              <td style={styles.td}>
                <button style={styles.gigLink} onClick={() => navigate(`/hiring/${r.gig_id}`)}>
                  {r.gigTitle}
                </button>
              </td>
              <td style={{ ...styles.td, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{r.transaction_id}</td>
              <td style={{ ...styles.td, fontWeight: 700, color: 'var(--color-danger)' }}>
                − SGD {r.amount.toLocaleString()}
              </td>
              <td style={{ ...styles.td, color: 'var(--color-text-secondary)' }}>{r.reason}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...STATUS_STYLE[r.status] }}>{r.status}</span>
              </td>
              <td style={{ ...styles.td, color: 'var(--color-text-muted)' }}>
                {new Date(r.created_at).toLocaleDateString('en-SG')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: 'var(--space-2) var(--space-3)',
    textAlign: 'left',
    borderBottom: '2px solid var(--color-border)',
    whiteSpace: 'nowrap',
  },
  tr:  { borderBottom: '1px solid var(--color-border)' },
  td: {
    padding: 'var(--space-3)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
  },
  gigLink: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  },
  empty: {
    padding: 'var(--space-10)',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
  },
}
