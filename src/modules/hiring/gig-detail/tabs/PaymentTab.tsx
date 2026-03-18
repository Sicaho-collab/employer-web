// Payment Tab — timesheet approval and payment release. All payments reference this Gig.

import { DataTable, Tag, Button } from '@sicaho-collab/ui-web'
import type { Column } from '@sicaho-collab/ui-web'

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

const STATUS_TAG_CLASS: Record<TimesheetEntry['status'], string> = {
  PENDING:  'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const columns: Column<TimesheetEntry>[] = [
  {
    key: 'week',
    header: 'Period',
    width: 200,
    minWidth: 140,
  },
  {
    key: 'hours',
    header: 'Hours',
    width: 80,
    minWidth: 60,
    align: 'right',
    cell: (row) => <span className="tabular-nums">{row.hours}</span>,
  },
  {
    key: 'rate',
    header: 'Rate',
    width: 100,
    minWidth: 70,
    align: 'right',
    cell: (row) => <span className="tabular-nums">{formatCurrency(row.rate)}/hr</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    width: 120,
    minWidth: 80,
    align: 'right',
    cell: (row) => <span className="tabular-nums">{formatCurrency(row.hours * row.rate)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
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
    width: 100,
    minWidth: 80,
    cell: () => (
      <Button variant="outlined" size="sm">
        Approve
      </Button>
    ),
  },
]

export default function PaymentTab() {
  const total = TIMESHEET_ENTRIES.reduce((sum, e) => sum + e.hours * e.rate, 0)

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment</h2>

      {/* Timesheet */}
      <section style={styles.section}>
        <h3 style={styles.subheading}>Timesheet</h3>
        <DataTable<TimesheetEntry>
          columns={columns}
          data={TIMESHEET_ENTRIES}
          emptyState="No timesheet entries"
          footerSlot={
            <tr>
              <td className="h-12 px-3 font-medium text-m3-on-surface">Total Pending</td>
              <td className="h-12 px-3" />
              <td className="h-12 px-3" />
              <td className="h-12 px-3 text-right font-medium text-m3-on-surface tabular-nums">
                {formatCurrency(total)}
              </td>
              <td className="h-12 px-3" />
              <td className="h-12 px-3" />
            </tr>
          }
        />
      </section>

      {/* Payment Release */}
      <section style={styles.section}>
        <h3 style={styles.subheading}>Release Payment</h3>
        <p style={styles.note}>
          Once all timesheets are approved, release payment to complete this gig.
        </p>
        <div style={styles.actions}>
          <Button variant="filled" disabled>
            Release Payment (timesheets pending)
          </Button>
        </div>
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    paddingBottom: 'var(--space-3)',
    borderBottom: '1px solid var(--color-border)',
  },
  section: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  subheading: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  note: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
  },
  actions: { display: 'flex', gap: 'var(--space-3)' },
}
