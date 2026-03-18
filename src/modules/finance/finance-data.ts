import { PaymentStatus } from '@/types/gig'

// ── Payment row type — single flat model ──

export type PaymentStatusLabel = 'Authorised' | 'Failed' | 'Paid' | 'Refunded'

export interface PaymentRow {
  id: string
  gig_id: string
  gigTitle: string
  amount: number
  status: PaymentStatusLabel
  date: string
  [key: string]: unknown
}

// Map PaymentStatus enum → user-friendly sentence-case labels
export const PAYMENT_STATUS_LABEL: Record<string, PaymentStatusLabel> = {
  [PaymentStatus.AUTHORISED]: 'Authorised',
  [PaymentStatus.FAILED]: 'Failed',
  [PaymentStatus.CAPTURED]: 'Paid',
  [PaymentStatus.REFUNDED]: 'Refunded',
}

// Status tag colour classes
export const STATUS_TAG_CLASS: Record<PaymentStatusLabel, string> = {
  Authorised: 'bg-blue-100 text-blue-800',
  Failed: 'bg-red-100 text-red-800',
  Paid: 'bg-emerald-100 text-emerald-800',
  Refunded: 'bg-orange-100 text-orange-800',
}

// Filter options
export const PAYMENT_STATUSES: PaymentStatusLabel[] = ['Authorised', 'Failed', 'Paid', 'Refunded']

// ── Mock data — replace with API fetch ──

export const PAYMENTS: PaymentRow[] = [
  { id: 'PAY-001', gig_id: 'g3',  gigTitle: 'Data Analyst',          amount: 1800, status: 'Paid',       date: '2025-02-01T09:00:00Z' },
  { id: 'PAY-002', gig_id: 'g2',  gigTitle: 'UX Researcher',         amount: 2400, status: 'Authorised', date: '2025-02-03T11:00:00Z' },
  { id: 'PAY-003', gig_id: 'g1',  gigTitle: 'Frontend Developer',    amount: 600,  status: 'Refunded',   date: '2025-01-28T14:00:00Z' },
  { id: 'PAY-004', gig_id: 'g4',  gigTitle: 'Content Writer',        amount: 950,  status: 'Paid',       date: '2025-01-15T10:30:00Z' },
  { id: 'PAY-005', gig_id: 'g5',  gigTitle: 'Social Media Manager',  amount: 1200, status: 'Failed',     date: '2025-02-05T16:00:00Z' },
  { id: 'PAY-006', gig_id: 'g6',  gigTitle: 'Graphic Designer',      amount: 3200, status: 'Authorised', date: '2025-02-08T09:15:00Z' },
  { id: 'PAY-007', gig_id: 'g7',  gigTitle: 'Video Editor',          amount: 1500, status: 'Paid',       date: '2025-02-10T14:45:00Z' },
  { id: 'PAY-008', gig_id: 'g8',  gigTitle: 'Event Coordinator',     amount: 2800, status: 'Authorised', date: '2025-02-12T08:00:00Z' },
  { id: 'PAY-009', gig_id: 'g9',  gigTitle: 'Research Assistant',    amount: 750,  status: 'Refunded',   date: '2025-02-14T11:30:00Z' },
  { id: 'PAY-010', gig_id: 'g10', gigTitle: 'Marketing Intern',      amount: 1100, status: 'Paid',       date: '2025-02-15T15:00:00Z' },
  { id: 'PAY-011', gig_id: 'g11', gigTitle: 'Data Entry Clerk',      amount: 500,  status: 'Authorised', date: '2025-02-18T13:00:00Z' },
  { id: 'PAY-012', gig_id: 'g12', gigTitle: 'Customer Support',      amount: 1600, status: 'Paid',       date: '2025-02-20T10:00:00Z' },
  { id: 'PAY-013', gig_id: 'g13', gigTitle: 'QA Tester',             amount: 2100, status: 'Failed',     date: '2025-02-22T09:00:00Z' },
  { id: 'PAY-014', gig_id: 'g14', gigTitle: 'DevOps Engineer',       amount: 3500, status: 'Paid',       date: '2025-02-25T11:00:00Z' },
  { id: 'PAY-015', gig_id: 'g15', gigTitle: 'Product Designer',      amount: 2700, status: 'Authorised', date: '2025-02-27T14:00:00Z' },
  { id: 'PAY-016', gig_id: 'g16', gigTitle: 'Copywriter',            amount: 800,  status: 'Paid',       date: '2025-03-01T10:00:00Z' },
  { id: 'PAY-017', gig_id: 'g17', gigTitle: 'Business Analyst',      amount: 1900, status: 'Refunded',   date: '2025-03-03T08:30:00Z' },
  { id: 'PAY-018', gig_id: 'g18', gigTitle: 'Illustrator',           amount: 1400, status: 'Paid',       date: '2025-03-05T16:00:00Z' },
  { id: 'PAY-019', gig_id: 'g19', gigTitle: 'SEO Specialist',        amount: 1050, status: 'Authorised', date: '2025-03-07T13:00:00Z' },
  { id: 'PAY-020', gig_id: 'g20', gigTitle: 'Motion Designer',       amount: 2200, status: 'Paid',       date: '2025-03-10T09:30:00Z' },
  { id: 'PAY-021', gig_id: 'g21', gigTitle: 'Project Coordinator',   amount: 1750, status: 'Failed',     date: '2025-03-12T11:00:00Z' },
  { id: 'PAY-022', gig_id: 'g22', gigTitle: 'Translator',            amount: 650,  status: 'Paid',       date: '2025-03-14T15:30:00Z' },
  { id: 'PAY-023', gig_id: 'g23', gigTitle: 'Community Manager',     amount: 1300, status: 'Authorised', date: '2025-03-15T10:00:00Z' },
]

// ── Summary computation ──

export interface FinanceSummary {
  totalSpend: number
  authorisedAmount: number
  paidThisMonth: number
}

export function computeSummary(payments: PaymentRow[]): FinanceSummary {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalSpend = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const authorisedAmount = payments
    .filter(p => p.status === 'Authorised')
    .reduce((sum, p) => sum + p.amount, 0)

  const paidThisMonth = payments
    .filter(p => p.status === 'Paid' && new Date(p.date) >= monthStart)
    .reduce((sum, p) => sum + p.amount, 0)

  return { totalSpend, authorisedAmount, paidThisMonth }
}

// ── Sorting utility ──

export function sortData<T>(data: T[], key: string, dir: 'asc' | 'desc'): T[] {
  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[key]
    const bVal = (b as Record<string, unknown>)[key]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return dir === 'asc' ? aVal - bVal : bVal - aVal
    }
    const aStr = String(aVal ?? '')
    const bStr = String(bVal ?? '')
    return dir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })
}

// ── Formatting ──

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatAmount(amount: number): string {
  return `AUD ${amount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ── Pagination ──

export const ROWS_PER_PAGE = 10

export function paginate<T>(data: T[], page: number): T[] {
  const start = (page - 1) * ROWS_PER_PAGE
  return data.slice(start, start + ROWS_PER_PAGE)
}

export function totalPages(dataLength: number): number {
  return Math.max(1, Math.ceil(dataLength / ROWS_PER_PAGE))
}

// ── Export & Download ──

/** Export filtered payment data as a CSV download */
export function exportPaymentsCSV(payments: PaymentRow[], filename = 'payments.csv') {
  const headers = ['Payment ID', 'Gig', 'Amount (AUD)', 'Status', 'Date']
  const rows = payments.map(p => [
    p.id,
    p.gigTitle,
    p.amount.toFixed(2),
    p.status,
    formatDate(p.date),
  ])
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** Download label based on payment status */
export function getDownloadLabel(status: PaymentStatusLabel): string | null {
  if (status === 'Paid') return 'Download Invoice'
  if (status === 'Refunded') return 'Download Refund Receipt'
  return null
}

/** Check if a payment has a downloadable document */
export function isDownloadable(status: PaymentStatusLabel): boolean {
  return status === 'Paid' || status === 'Refunded'
}

/** Stub: generate and download an invoice/receipt PDF for a payment.
 *  Replace with real API call when backend is ready. */
export function downloadPaymentDocument(payment: PaymentRow) {
  // TODO: Replace with API call → GET /api/payments/:id/invoice
  const docType = payment.status === 'Refunded' ? 'Refund Receipt' : 'Invoice'
  const filename = `${docType.replace(' ', '-')}_${payment.id}.pdf`

  // Placeholder: download a text summary as a stand-in until the API is wired up
  const content = [
    `Alumable — ${docType}`,
    ``,
    `Payment ID: ${payment.id}`,
    `Gig: ${payment.gigTitle}`,
    `Amount: AUD $${payment.amount.toFixed(2)}`,
    `Status: ${payment.status}`,
    `Date: ${formatDate(payment.date)}`,
  ].join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
