// Applications Tab — list of applicants with review/shortlist/select actions.

import { DataTable, Tag, Button } from '@sicaho-collab/ui-web'
import type { Column } from '@sicaho-collab/ui-web'

interface Applicant {
  id: string
  name: string
  course: string
  university: string
  appliedAt: string
  status: 'PENDING' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED'
}

const STATUS_TAG_CLASS: Record<Applicant['status'], string> = {
  PENDING:     'bg-amber-100 text-amber-800',
  SHORTLISTED: 'bg-blue-100 text-blue-800',
  SELECTED:    'bg-emerald-100 text-emerald-800',
  REJECTED:    'bg-red-100 text-red-800',
}

// Placeholder data — replace with fetch
const APPLICANTS: Applicant[] = [
  { id: 'a1', name: 'Alex Chen',    course: 'BSc Computer Science', university: 'NUS',     appliedAt: '2025-01-16', status: 'SHORTLISTED' },
  { id: 'a2', name: 'Priya Rajan',  course: 'BEng Software Eng',    university: 'NTU',     appliedAt: '2025-01-17', status: 'PENDING'     },
  { id: 'a3', name: 'Jay Lim',      course: 'BSc Information Sys',  university: 'SMU',     appliedAt: '2025-01-18', status: 'PENDING'     },
  { id: 'a4', name: 'Sara Ng',      course: 'BA Design',            university: 'LASALLE', appliedAt: '2025-01-19', status: 'REJECTED'    },
]

const columns: Column<Applicant>[] = [
  {
    key: 'name',
    header: 'Name',
    width: 160,
    minWidth: 120,
  },
  {
    key: 'course',
    header: 'Course',
    width: 200,
    minWidth: 140,
  },
  {
    key: 'university',
    header: 'University',
    width: 140,
    minWidth: 100,
  },
  {
    key: 'appliedAt',
    header: 'Applied',
    sortable: true,
    width: 120,
    minWidth: 90,
    cell: (row) => <span className="text-m3-on-surface-variant">{row.appliedAt}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: 120,
    minWidth: 90,
    cell: (row) => (
      <Tag size="sm" className={STATUS_TAG_CLASS[row.status]}>
        {row.status}
      </Tag>
    ),
  },
  {
    key: 'actions',
    header: '',
    width: 120,
    minWidth: 100,
    cell: () => (
      <Button
        variant="outlined"
        size="sm"
        className="hover:bg-m3-primary/8 hover:text-m3-primary hover:ring-1 hover:ring-inset hover:ring-m3-primary/30"
      >
        View Profile
      </Button>
    ),
  },
]

export default function ApplicationsTab() {
  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <h2 style={styles.heading}>Applicants</h2>
        <span style={styles.count}>{APPLICANTS.length} total</span>
      </div>

      <DataTable<Applicant>
        columns={columns}
        data={APPLICANTS}
        searchPlaceholder="Search applicants..."
        emptyState="No applicants yet"
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  titleRow:  { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  count: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    background: 'var(--color-border)',
    padding: '2px 8px',
    borderRadius: 100,
  },
}
