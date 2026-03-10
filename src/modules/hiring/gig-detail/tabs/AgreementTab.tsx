// Agreement Tab — offer terms, acceptance status, and agreement document.

export default function AgreementTab() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Agreement</h2>

      {/* Offer Status */}
      <section style={styles.section}>
        <h3 style={styles.subheading}>Offer Status</h3>
        <div style={styles.statusRow}>
          <StatusStep label="Offer Created"   done />
          <div style={styles.connector} />
          <StatusStep label="Offer Sent"      done={false} />
          <div style={styles.connector} />
          <StatusStep label="Offer Accepted"  done={false} />
        </div>
      </section>

      {/* Agreement Terms Preview */}
      <section style={styles.section}>
        <h3 style={styles.subheading}>Terms Summary</h3>
        <dl style={styles.dl}>
          <Row label="Start Date"      value="1 Feb 2025"   />
          <Row label="End Date"        value="1 Apr 2025"   />
          <Row label="Rate"            value="$30 / hr"     />
          <Row label="Max Hours"       value="20 hrs/week"  />
          <Row label="Payment Terms"   value="Upon timesheet approval" />
        </dl>
      </section>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.btnPrimary}>Send Offer to Student</button>
        <button style={styles.btnSecondary}>Preview Agreement</button>
      </div>
    </div>
  )
}

function StatusStep({ label, done }: { label: string; done: boolean }) {
  return (
    <div style={styles.step}>
      <div style={{ ...styles.dot, background: done ? 'var(--color-success)' : 'var(--color-border)' }} />
      <span style={{ ...styles.stepLabel, color: done ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
        {label}
      </span>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt style={styles.dt}>{label}</dt>
      <dd style={styles.dd}>{value}</dd>
    </>
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
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
  },
  stepLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  connector: {
    height: 2,
    width: 60,
    background: 'var(--color-border)',
    marginBottom: 18,
  },
  dl: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr',
    gap: 'var(--space-2) var(--space-4)',
    alignItems: 'baseline',
  },
  dt: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
  },
  dd: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
  },
  actions: {
    display: 'flex',
    gap: 'var(--space-3)',
    paddingTop: 'var(--space-2)',
  },
  btnPrimary: {
    padding: 'var(--space-2) var(--space-5)',
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: 'var(--space-2) var(--space-5)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
