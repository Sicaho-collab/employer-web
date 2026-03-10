import PageHeader from '@/components/ui/PageHeader'
import type { Organisation, TeamMember } from '@/types/gig'

// Placeholder data — replace with org context/fetch
const ORG: Organisation = {
  id: 'org1',
  name: 'Acme Corp',
  industry: 'Technology',
  created_at: '2024-06-01T00:00:00Z',
}

const TEAM: TeamMember[] = [
  { id: 'u1', org_id: 'org1', name: 'Jessica Ho',  email: 'jessica@acme.com',  role: 'ADMIN',           joined_at: '2024-06-01T00:00:00Z' },
  { id: 'u2', org_id: 'org1', name: 'Ryan Tan',    email: 'ryan@acme.com',     role: 'HIRING_MANAGER',  joined_at: '2024-07-15T00:00:00Z' },
  { id: 'u3', org_id: 'org1', name: 'Mei Lin',     email: 'mei@acme.com',      role: 'FINANCE',         joined_at: '2024-09-01T00:00:00Z' },
]

const ROLE_STYLE: Record<TeamMember['role'], React.CSSProperties> = {
  ADMIN:          { color: '#4C1D95', background: '#EDE9FE' },
  HIRING_MANAGER: { color: '#1E40AF', background: '#DBEAFE' },
  FINANCE:        { color: '#065F46', background: '#D1FAE5' },
}

export default function OrganisationPage() {
  return (
    <div style={styles.page}>
      <PageHeader
        title="Organisation"
        subtitle="Manage your company profile and team members."
      />

      <div style={styles.layout}>
        {/* ── Company Profile ── */}
        <section style={styles.card}>
          <h2 style={styles.sectionHeading}>Company Profile</h2>
          <dl style={styles.dl}>
            <Row label="Company Name" value={ORG.name} />
            <Row label="Industry"     value={ORG.industry} />
            <Row label="Member Since" value={new Date(ORG.created_at).toLocaleDateString('en-SG', { year: 'numeric', month: 'long' })} />
          </dl>
          <button style={styles.editBtn}>Edit Profile</button>
        </section>

        {/* ── Team Members ── */}
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionHeading}>Team Members</h2>
            <button style={styles.inviteBtn}>+ Invite Member</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM.map((member) => (
                <tr key={member.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{member.name}</td>
                  <td style={{ ...styles.td, color: 'var(--color-text-secondary)' }}>{member.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...ROLE_STYLE[member.role] }}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: 'var(--color-text-muted)' }}>
                    {new Date(member.joined_at).toLocaleDateString('en-SG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
      </div>
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
  page: {
    maxWidth: 'var(--content-max-w)',
    margin: '0 auto',
    padding: 'var(--space-6) var(--space-4)',
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-5)',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  },
  sectionHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  sectionHeading: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  dl: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
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
  editBtn: {
    alignSelf: 'flex-start',
    padding: 'var(--space-2) var(--space-4)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  inviteBtn: {
    padding: 'var(--space-2) var(--space-4)',
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
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
    borderBottom: '2px solid var(--color-border)',
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
}
