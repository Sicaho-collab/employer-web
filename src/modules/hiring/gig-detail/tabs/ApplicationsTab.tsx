// Applications Tab — list of applicants with review/shortlist/select actions.

interface Applicant {
  id: string
  name: string
  course: string
  university: string
  appliedAt: string
  status: 'PENDING' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED'
}

const STATUS_STYLE: Record<Applicant['status'], React.CSSProperties> = {
  PENDING:     { color: '#92400E', background: '#FEF3C7' },
  SHORTLISTED: { color: '#1E40AF', background: '#DBEAFE' },
  SELECTED:    { color: '#065F46', background: '#D1FAE5' },
  REJECTED:    { color: '#7F1D1D', background: '#FEE2E2' },
}

// Placeholder data — replace with fetch
const APPLICANTS: Applicant[] = [
  { id: 'a1', name: 'Alex Chen',    course: 'BSc Computer Science', university: 'NUS',     appliedAt: '2025-01-16', status: 'SHORTLISTED' },
  { id: 'a2', name: 'Priya Rajan',  course: 'BEng Software Eng',    university: 'NTU',     appliedAt: '2025-01-17', status: 'PENDING'     },
  { id: 'a3', name: 'Jay Lim',      course: 'BSc Information Sys',  university: 'SMU',     appliedAt: '2025-01-18', status: 'PENDING'     },
  { id: 'a4', name: 'Sara Ng',      course: 'BA Design',            university: 'LASALLE', appliedAt: '2025-01-19', status: 'REJECTED'    },
]

export default function ApplicationsTab() {
  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <h2 style={styles.heading}>Applicants</h2>
        <span style={styles.count}>{APPLICANTS.length} total</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['Name', 'Course', 'University', 'Applied', 'Status', 'Action'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {APPLICANTS.map((a) => (
            <tr key={a.id} style={styles.tr}>
              <td style={{ ...styles.td, fontWeight: 600 }}>{a.name}</td>
              <td style={styles.td}>{a.course}</td>
              <td style={styles.td}>{a.university}</td>
              <td style={{ ...styles.td, color: 'var(--color-text-muted)' }}>{a.appliedAt}</td>
              <td style={styles.td}>
                <span style={{ ...styles.statusBadge, ...STATUS_STYLE[a.status] }}>
                  {a.status}
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.actionBtn}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  titleRow:  { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
  heading: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  count: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
    background: 'var(--color-border)',
    padding: '2px 8px',
    borderRadius: 100,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
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
  tr: {
    borderBottom: '1px solid var(--color-border)',
  },
  td: {
    padding: 'var(--space-3)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
    verticalAlign: 'middle',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
  },
  actionBtn: {
    padding: '4px 10px',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-surface)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
  },
}
