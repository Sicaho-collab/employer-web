// Transactions View — all payments linked to a Gig.
import type { Transaction } from '@/types/gig'
import { useNavigate } from 'react-router-dom'

const STATUS_STYLE: Record<Transaction['status'], React.CSSProperties> = {
  PENDING:   { color: '#92400E', background: '#FEF3C7' },
  COMPLETED: { color: '#065F46', background: '#D1FAE5' },
  FAILED:    { color: '#7F1D1D', background: '#FEE2E2' },
}

// Placeholder data — replace with API fetch
const TRANSACTIONS: (Transaction & { gigTitle: string })[] = [
  { id: 't1', gig_id: 'g3', gigTitle: 'Data Analyst',      amount: 1800, currency: 'SGD', type: 'PAYMENT', status: 'COMPLETED', created_at: '2025-02-01T09:00:00Z' },
  { id: 't2', gig_id: 'g2', gigTitle: 'UX Researcher',     amount: 2400, currency: 'SGD', type: 'PAYMENT', status: 'PENDING',   created_at: '2025-02-03T11:00:00Z' },
  { id: 't3', gig_id: 'g1', gigTitle: 'Frontend Developer', amount: 600, currency: 'SGD', type: 'REFUND',  status: 'COMPLETED', created_at: '2025-01-28T14:00:00Z' },
]

export default function TransactionsView() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['ID', 'Linked Gig', 'Type', 'Amount', 'Status', 'Date'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map((tx) => (
            <tr key={tx.id} style={styles.tr}>
              <td style={{ ...styles.td, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                {tx.id}
              </td>
              <td style={styles.td}>
                <button
                  style={styles.gigLink}
                  onClick={() => navigate(`/hiring/${tx.gig_id}`)}
                >
                  {tx.gigTitle}
                </button>
              </td>
              <td style={styles.td}>
                <span style={{ color: tx.type === 'REFUND' ? 'var(--color-danger)' : 'var(--color-text-primary)', fontWeight: 600 }}>
                  {tx.type}
                </span>
              </td>
              <td style={{ ...styles.td, fontWeight: 700 }}>
                {tx.type === 'REFUND' ? '−' : ''}
                {tx.currency} {tx.amount.toLocaleString()}
              </td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...STATUS_STYLE[tx.status] }}>
                  {tx.status}
                </span>
              </td>
              <td style={{ ...styles.td, color: 'var(--color-text-muted)' }}>
                {new Date(tx.created_at).toLocaleDateString('en-SG')}
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
  tr: { borderBottom: '1px solid var(--color-border)' },
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
}
