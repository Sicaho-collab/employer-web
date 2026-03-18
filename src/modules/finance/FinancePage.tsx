import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, DataTable, Tag, Button, Icon, SimpleTooltip, Menu, MenuTrigger, MenuContent, MenuItem } from '@sicaho-collab/ui-web'
import type { Column } from '@sicaho-collab/ui-web'
import PageHeader from '@/components/ui/PageHeader'
import { formatCurrency } from '@/modules/hiring/post-gig-v3/fee-utils'
import PaymentDetailDialog from './PaymentDetailDialog'
import {
  PAYMENTS,
  computeSummary,
  formatAmount,
  formatDate,
  sortData,
  paginate,
  totalPages,
  ROWS_PER_PAGE,
  STATUS_TAG_CLASS,
  exportPaymentsCSV,
  isDownloadable,
  downloadPaymentDocument,
  PAYMENT_STATUSES,
} from './finance-data'
import type { PaymentRow, PaymentStatusLabel } from './finance-data'

const summary = computeSummary(PAYMENTS)

const SUMMARY_CARDS = [
  { label: 'Total Spend',       value: formatAmount(summary.totalSpend),       icon: 'attach_money',  color: 'text-m3-primary' },
  { label: 'Pending Payments',  value: formatAmount(summary.authorisedAmount), icon: 'schedule',      color: 'text-amber-600' },
  { label: 'Paid This Month',   value: formatAmount(summary.paidThisMonth),    icon: 'check_circle',  color: 'text-emerald-600' },
]

const columns: Column<PaymentRow>[] = [
  {
    key: 'id',
    header: 'ID',
    width: 100,
    minWidth: 80,
    cell: (row) => <span className="font-mono text-xs">{row.id}</span>,
  },
  {
    key: 'gigTitle',
    header: 'Gig',
    width: 240,
    minWidth: 160,
    cell: (row) => (
      <Link
        to={`/hiring/${row.gig_id}`}
        onClick={(e) => e.stopPropagation()}
        className="text-m3-primary hover:underline"
      >
        {row.gigTitle}
      </Link>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    sortable: true,
    align: 'right',
    width: 120,
    minWidth: 90,
    cell: (row) => (
      <span className="tabular-nums">{formatCurrency(row.amount)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: 120,
    minWidth: 90,
    cell: (row) => (
      <Tag className={STATUS_TAG_CLASS[row.status]}>
        {row.status}
      </Tag>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    sortable: true,
    width: 120,
    minWidth: 90,
    cell: (row) => formatDate(row.date),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    width: 80,
    minWidth: 56,
    cell: (row) =>
      isDownloadable(row.status) ? (
        <SimpleTooltip text={row.status === 'Refunded' ? 'Download refund receipt' : 'Download invoice'} position="top">
          <Button
            variant="ghost"
            size="icon"
            className="text-m3-on-surface-variant hover:bg-m3-primary/8 hover:text-m3-primary hover:ring-1 hover:ring-inset hover:ring-m3-primary/30 active:bg-m3-primary/12"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); downloadPaymentDocument(row) }}
            aria-label={`Download ${row.status === 'Refunded' ? 'refund receipt' : 'invoice'} for ${row.id}`}
          >
            <span className="material-symbols-outlined">download</span>
          </Button>
        </SimpleTooltip>
      ) : null,
  },
]

export default function FinancePage() {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'All' | PaymentStatusLabel>('All')
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Search + filter
  const filtered = useMemo(() => {
    let data = PAYMENTS
    if (filter !== 'All') data = data.filter(p => p.status === filter)
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(
      p => p.gigTitle.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    )
  }, [search, filter])

  // Sort
  const sorted = useMemo(() => sortData(filtered, sortKey, sortDir), [filtered, sortKey, sortDir])

  // Paginate
  const total = totalPages(sorted.length)
  const pageData = useMemo(() => paginate(sorted, page), [sorted, page])

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function handleRowClick(row: PaymentRow) {
    setSelectedPayment(row)
    setDialogOpen(true)
  }

  return (
    <div className="max-w-[var(--content-max-w)] mx-auto px-4 md:px-6 py-6 md:py-8">
      <PageHeader
        title="Finance"
        subtitle="All payments across your gigs."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {SUMMARY_CARDS.map(({ label, value, icon, color }) => (
          <Card key={label} variant="outlined">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-m3-full p-2 bg-m3-surface-container ${color}`}>
                <Icon name={icon} size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-m3-on-surface-variant truncate">{label}</p>
                <p className="text-lg font-semibold text-m3-on-surface tabular-nums">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Table */}
      <DataTable<PaymentRow>
        columns={columns}
        data={pageData}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onRowClick={handleRowClick}
        searchValue={search}
        onSearchChange={(v: string) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by gig title or payment ID..."
        toolbarSlot={
          <div className="flex items-center gap-2">
            <Menu>
              <MenuTrigger asChild>
                <Button variant="outlined" size="sm">
                  <Icon name="filter_list" /> Filter
                  {filter !== 'All' && (
                    <span className="text-xs bg-m3-primary text-m3-on-primary rounded-m3-xs px-1.5 py-0.5 leading-none">1</span>
                  )}
                </Button>
              </MenuTrigger>
              <MenuContent>
                {(['All', ...PAYMENT_STATUSES] as const).map((s) => (
                  <MenuItem key={s} onClick={() => { setFilter(s); setPage(1) }} className={filter === s ? 'font-medium' : ''}>
                    {s}
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
            <Button variant="outlined" size="sm" onClick={() => exportPaymentsCSV(sorted)}>
              <Icon name="download" />
              Export
            </Button>
          </div>
        }
        page={page}
        totalPages={total}
        onPageChange={setPage}
        totalRows={sorted.length}
        rowsPerPage={ROWS_PER_PAGE}
        emptyState="No payments found"
      />

      {/* Payment Detail Dialog */}
      <PaymentDetailDialog
        payment={selectedPayment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
