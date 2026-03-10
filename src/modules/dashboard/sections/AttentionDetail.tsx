// Detail view for "Check what needs attention" — full prioritized list with categories.
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Gig } from '@/types/gig'
import {
  GigStage,
  OfferStatus,
  PaymentStatus,
  TimesheetStatus,
  ErrorStatus,
} from '@/types/gig'
import { getAttentionMessage, getGigAttentionInfo, getGigCTA } from '@/utils/gigDisplay'

interface AttentionCategory {
  title: string
  gigs: Gig[]
}

// Placeholder data — replace with real attention-flagged gigs query
const ALL_ATTENTION_GIGS: Gig[] = [
  {
    id: 'g-err', title: 'Backend Engineer', stage: GigStage.DONE,
    description: 'API development',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.FAILED,
    timesheet_status: TimesheetStatus.APPROVED,
    error_status: ErrorStatus.PAYMENT_FAILED,
    applicant_count: 3, matched_student_id: 'u5',
    start_date: '2025-10-01', end_date: '2026-01-31',
    created_at: '2025-09-15T00:00:00Z', updated_at: '2026-03-08T00:00:00Z',
  },
  {
    id: 'g2', title: 'UX Researcher', stage: GigStage.ACTIVE,
    description: 'Conduct user interviews',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.SUBMITTED,
    error_status: ErrorStatus.NONE,
    applicant_count: 7, matched_student_id: 'u2',
    start_date: '2026-01-20', end_date: '2026-03-15',
    created_at: '2026-01-05T00:00:00Z', updated_at: '2026-03-06T09:00:00Z',
  },
  {
    id: 'g4', title: 'Copywriter', stage: GigStage.POSTED,
    description: 'Write product descriptions',
    is_published: true,
    offer_status: OfferStatus.NONE,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 8,
    start_date: '2026-03-01', end_date: '2026-05-01',
    created_at: '2026-01-28T00:00:00Z', updated_at: '2026-01-28T00:00:00Z',
  },
  {
    id: 'g3', title: 'Data Analyst', stage: GigStage.DONE,
    description: 'Analyse survey data',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.APPROVED,
    error_status: ErrorStatus.NONE,
    applicant_count: 5, matched_student_id: 'u3',
    start_date: '2025-12-01', end_date: '2026-01-31',
    created_at: '2025-11-20T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
  },
]

function categorizeGigs(gigs: Gig[]): AttentionCategory[] {
  const errors: Gig[] = []
  const expiring: Gig[] = []
  const pendingApps: Gig[] = []
  const timesheets: Gig[] = []
  const payments: Gig[] = []

  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  for (const gig of gigs) {
    if (gig.error_status !== ErrorStatus.NONE || gig.payment_status === PaymentStatus.FAILED || gig.payment_status === PaymentStatus.DISPUTED) {
      errors.push(gig)
    } else if (gig.stage === GigStage.ACTIVE && gig.end_date && new Date(gig.end_date) <= sevenDaysFromNow) {
      expiring.push(gig)
    } else if (gig.stage === GigStage.POSTED && gig.is_published && gig.applicant_count > 0) {
      pendingApps.push(gig)
    } else if (gig.timesheet_status === TimesheetStatus.SUBMITTED || gig.timesheet_status === TimesheetStatus.OVERDUE) {
      timesheets.push(gig)
    } else if (gig.stage === GigStage.DONE && gig.payment_status === PaymentStatus.NOT_REQUIRED) {
      payments.push(gig)
    }
  }

  const categories: AttentionCategory[] = []
  if (errors.length > 0) categories.push({ title: 'Errors & Failures', gigs: errors })
  if (expiring.length > 0) categories.push({ title: 'Expiring Soon', gigs: expiring })
  if (pendingApps.length > 0) categories.push({ title: 'Pending Applications', gigs: pendingApps })
  if (timesheets.length > 0) categories.push({ title: 'Timesheets Awaiting Action', gigs: timesheets })
  if (payments.length > 0) categories.push({ title: 'Payments to Release', gigs: payments })
  return categories
}

export default function AttentionDetail() {
  const navigate = useNavigate()
  const categories = categorizeGigs(ALL_ATTENTION_GIGS)
  const totalCount = ALL_ATTENTION_GIGS.length

  return (
    <div className="max-w-[var(--content-max-w)] mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="text" size="icon" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
          <ArrowLeft />
        </Button>
        <AlertTriangle className="size-5 text-m3-primary" />
        <h1 className="text-[var(--text-xl)] font-bold text-m3-on-surface flex-1">
          Needs your attention
        </h1>
        {totalCount > 0 && <Badge count={totalCount} />}
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3">
          <CheckCircle2 className="size-12 text-m3-primary" />
          <p className="text-[var(--text-sm)] text-m3-on-surface-variant">
            You're all caught up!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {categories.map((category) => (
            <section key={category.title}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-[var(--text-base)] font-semibold text-m3-on-surface">
                  {category.title}
                </h2>
                <Badge count={category.gigs.length} />
              </div>
              <div className="flex flex-col gap-2">
                {category.gigs.map((gig) => {
                  const { hasError } = getGigAttentionInfo(gig)
                  return (
                    <div
                      key={gig.id}
                      className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-m3-md border ${
                        hasError
                          ? 'bg-m3-error-container border-m3-error/30'
                          : 'bg-m3-surface-container-low border-m3-outline-variant'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--text-sm)] font-medium text-m3-on-surface truncate">
                          {gig.title}
                        </p>
                        <p className="text-[11px] text-m3-on-surface-variant mt-0.5">
                          {getAttentionMessage(gig)}
                        </p>
                      </div>
                      <Button
                        variant="outlined"
                        size="sm"
                        className="shrink-0 text-[var(--text-xs)] h-7 px-3"
                        onClick={() => navigate(`/hiring/${gig.id}`)}
                      >
                        {getGigCTA(gig)}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
