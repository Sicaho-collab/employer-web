// Invoices View — all invoices linked to a Gig.
import type { Invoice } from '@/types/gig'
import { useNavigate } from 'react-router-dom'

const STATUS_STYLE: Record<Invoice['status'], React.CSSProperties> = {
  DRAFT:   { color: '#334155', background: '#F1F5F9' },
  SENT:    { color: '#1E40AF', background: '#DBEAFE' },
  PAID:    { color: '#065F46', background: '#D1FAE5' },
  OVERDUE: { color: '#7F1D1D', background: '#FEE2E2' },
}

// Placeholder data
const INVOICES: (Invoice & { gigTitle: string })[] = [
  { id: 'inv-001', gig_id: 'g3', gigTitle: 'Data Analyst',       amount: 1800, currency: 'SGD', status: 'PAID',    issued_at: '2025-01-31T00:00:00Z', due_at: '2025-02-14T00:00:00Z' },
  { id: 'inv-002', gig_id: 'g2', gigTitle: 'UX Researcher',      amount: 2400, currency: 'SGD', status: 'SENT',    issued_at: '2025-02-03T00:00:00Z', due_at: '2025-02-17T00:00:00Z' },
  { id: 'inv-003', gig_id: 'g1', gigTitle: 'Frontend Developer', amount: 3600, currency: 'SGD', status: 'OVERDUE', issued_at: '2025-01-20T00:00:00Z', due_at: '2025-02-03T00:00:00Z' },
]

export default function InvoicesView() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['Invoice', 'Linked Gig', 'Amount', 'Status', 'Issued', 'Due'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {INVOICES.map((inv) => (
            <tr key={inv.id} style={styles.tr}>
              <td style={{ ...styles.td, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                {inv.id}
              </td>
              <td style={styles.td}>
                <button style={styles.gigLink} onClick={() => navigate(`/hiring/${inv.gig_id}`)}>
                  {inv.gigTitle}
                </button>
              </td>
              <td style={{ ...styles.td, fontWeight: 700 }}>
                {inv.currency} {inv.amount.toLocaleString()}
              </td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...STATUS_STYLE[inv.status] }}>
                  {inv.status}
                </span>
              </td>
              <td style={{ ...styles.td, color: 'var(--color-text-muted)' }}>
                {new Date(inv.issued_at).toLocaleDateString('en-SG')}
              </td>
              <td style={{ ...styles.td, color: inv.status === 'OVERDUE' ? 'var(--color-danger)' : 'var(--color-text-muted)', fontWeight: inv.status === 'OVERDUE' ? 700 : 400 }}>
                {new Date(inv.due_at).toLocaleDateString('en-SG')}
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
}
