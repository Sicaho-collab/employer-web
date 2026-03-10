// Payment Tab — timesheet approval and payment release. All payments reference this Gig.

interface TimesheetEntry {
  week: string
  hours: number
  rate: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

const TIMESHEET_ENTRIES: TimesheetEntry[] = [
  { week: 'Week 1 (Feb 1–7)',   hours: 18, rate: 30, status: 'PENDING' },
  { week: 'Week 2 (Feb 8–14)',  hours: 20, rate: 30, status: 'PENDING' },
]

const STATUS_STYLE: Record<TimesheetEntry['status'], React.CSSProperties> = {
  PENDING:  { color: '#92400E', background: '#FEF3C7' },
  APPROVED: { color: '#065F46', background: '#D1FAE5' },
  REJECTED: { color: '#7F1D1D', background: '#FEE2E2' },
}

export default function PaymentTab() {
  const total = TIMESHEET_ENTRIES.reduce((sum, e) => sum + e.hours * e.rate, 0)

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment</h2>

      {/* Timesheet */}
      <section style={styles.section}>
        <h3 style={styles.subheading}>Timesheet</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Period', 'Hours', 'Rate', 'Amount', 'Status', 'Action'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMESHEET_ENTRIES.map((entry) => (
              <tr key={entry.week} style={styles.tr}>
                <td style={styles.td}>{entry.week}</td>
                <td style={styles.td}>{entry.hours}</td>
                <td style={styles.td}>${entry.rate}/hr</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>${entry.hours * entry.rate}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...STATUS_STYLE[entry.status] }}>
                    {entry.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.approveBtn}>Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Pending</span>
          <span style={styles.totalValue}>${total.toLocaleString()}</span>
        </div>
      </section>

      {/* Payment Release */}
      <section style={styles.section}>
        <h3 style={styles.subheading}>Release Payment</h3>
        <p style={styles.note}>
          Once all timesheets are approved, release payment to complete this gig.
        </p>
        <div style={styles.actions}>
          <button style={styles.btnPrimary} disabled>
            Release Payment (timesheets pending)
          </button>
        </div>
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  heading: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    paddingBottom: 'var(--space-3)',
    borderBottom: '1px solid var(--color-border)',
  },
  section: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  subheading: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: 'var(--space-2) var(--space-3)',
    textAlign: 'left',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
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
  approveBtn: {
    padding: '4px 10px',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-surface)',
    cursor: 'pointer',
    color: 'var(--color-primary)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    gap: 'var(--space-4)',
    paddingTop: 'var(--space-3)',
    borderTop: '1px solid var(--color-border)',
  },
  totalLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
  },
  totalValue: {
    fontSize: 'var(--text-xl)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
  },
  note: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  actions: { display: 'flex', gap: 'var(--space-3)' },
  btnPrimary: {
    padding: 'var(--space-2) var(--space-5)',
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'not-allowed',
    opacity: 0.5,
  },
}
