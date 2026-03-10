// Overview Tab — gig description, requirements, timeline, stage flags summary.
export default function OverviewTab() {
  return (
    <div style={styles.container}>
      <section style={styles.section}>
        <h2 style={styles.heading}>Gig Details</h2>
        <dl style={styles.dl}>
          <Row label="Role"         value="Frontend Developer" />
          <Row label="Duration"     value="8 weeks (Feb 1 – Apr 1, 2025)" />
          <Row label="Commitment"   value="20 hrs / week" />
          <Row label="Format"       value="Remote" />
          <Row label="Compensation" value="$30 / hr" />
        </dl>
      </section>

      <section style={styles.section}>
        <h2 style={styles.heading}>Requirements</h2>
        <ul style={styles.list}>
          <li>React + TypeScript experience</li>
          <li>Familiarity with design systems</li>
          <li>Available for weekly syncs</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.heading}>Status Flags</h2>
        <dl style={styles.dl}>
          <Row label="Published"            value="Yes" />
          <Row label="Offer Sent"           value="No" />
          <Row label="Timesheet Submitted"  value="No" />
          <Row label="Payment Released"     value="No" />
        </dl>
      </section>
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
  section:   { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  heading: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    paddingBottom: 'var(--space-2)',
    borderBottom: '1px solid var(--color-border)',
  },
  dl: {
    display: 'grid',
    gridTemplateColumns: 'minmax(100px, 160px) 1fr',
    gap: 'var(--space-2) var(--space-3)',
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
  list: {
    paddingLeft: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
  },
}
