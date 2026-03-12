// Detail view for "Continue where I left off" — shows full recent activity list.
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@sicaho-collab/ui-web'
import StageBadge from '@/components/ui/StageBadge'
import type { Gig } from '@/types/gig'
import {
  GigStage,
  OfferStatus,
  PaymentStatus,
  TimesheetStatus,
  ErrorStatus,
} from '@/types/gig'

function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(dateString).toLocaleDateString()
}

function getActivityLabel(gig: Gig): string {
  if (gig.stage === GigStage.POSTED && !gig.is_published) return 'Draft — continue editing'
  if (gig.offer_status === OfferStatus.SENT) return 'Offer sent — awaiting response'
  if (gig.timesheet_status === TimesheetStatus.SUBMITTED) return 'Timesheet pending approval'
  if (gig.stage === GigStage.ACTIVE) return 'In progress — check status'
  if (gig.stage === GigStage.MATCHED) return 'Matched — next steps available'
  if (gig.stage === GigStage.DONE) return 'Completed — review payment'
  if (gig.stage === GigStage.POSTED && gig.applicant_count > 0) {
    return `${gig.applicant_count} applicant${gig.applicant_count === 1 ? '' : 's'} to review`
  }
  return 'Updated recently'
}

// Placeholder data — replace with real recent gigs query (sorted by updated_at DESC)
const RECENT_GIGS: Gig[] = [
  {
    id: 'g1', title: 'Frontend Developer', stage: GigStage.MATCHED,
    description: 'Build UI components',
    is_published: true,
    offer_status: OfferStatus.SENT,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 12, matched_student_id: 'u1',
    start_date: '2026-04-01', end_date: '2026-06-01',
    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-09T10:30:00Z',
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
    created_at: '2025-11-20T00:00:00Z', updated_at: '2026-03-08T14:00:00Z',
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
    start_date: '2026-01-20', end_date: '2026-03-20',
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
    created_at: '2026-01-28T00:00:00Z', updated_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'g5', title: 'Social Media Manager', stage: GigStage.POSTED,
    description: 'Manage social channels',
    is_published: false,
    offer_status: OfferStatus.NONE,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 0,
    start_date: '2026-04-01', end_date: '2026-06-01',
    created_at: '2026-02-10T00:00:00Z', updated_at: '2026-02-10T00:00:00Z',
  },
]

export default function RecentActivity() {
  const navigate = useNavigate()

  return (
    <div className="max-w-[var(--content-max-w)] mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="text" size="icon" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
          <ArrowLeft />
        </Button>
        <Clock className="size-5 text-m3-primary" />
        <h1 className="text-[var(--text-xl)] font-bold text-m3-on-surface">
          Continue where I left off
        </h1>
      </div>

      {RECENT_GIGS.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-sm)] text-m3-on-surface-variant mb-4">
            No recent activity yet. Post your first gig to get started.
          </p>
          <Button variant="filled" onClick={() => navigate('/hiring/new')}>
            Post a Gig
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {RECENT_GIGS.map((gig) => (
            <button
              key={gig.id}
              className="w-full flex items-center gap-4 p-4 bg-m3-surface-container-low border border-m3-outline-variant rounded-m3-md hover:shadow-m3-1 transition-shadow text-left"
              onClick={() => navigate(`/hiring/${gig.id}`)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-[var(--text-sm)] font-medium text-m3-on-surface truncate">
                    {gig.title}
                  </p>
                  <StageBadge gig={gig} />
                </div>
                <p className="text-[11px] text-m3-on-surface-variant">
                  {getActivityLabel(gig)}
                </p>
              </div>
              <span className="text-[11px] text-m3-on-surface-variant whitespace-nowrap shrink-0">
                {formatRelativeTime(gig.updated_at)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
