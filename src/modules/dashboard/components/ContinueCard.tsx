import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Icon } from '@sicaho-collab/ui-web'
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

// Placeholder data — replace with real recent gigs query
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
]

export default function ContinueCard() {
  const navigate = useNavigate()
  const hasItems = RECENT_GIGS.length > 0

  return (
    <Card variant="elevated" className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon name="schedule" size={20} className="text-m3-primary shrink-0" />
        <CardTitle>Continue where I left off</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        {hasItems ? (
          <ul className="flex flex-col gap-2">
            {RECENT_GIGS.map((gig) => (
              <li key={gig.id}>
                <button
                  className="w-full flex items-center gap-3 rounded-m3-sm p-2 -mx-2 hover:bg-m3-on-surface/[0.04] transition-colors text-left"
                  onClick={() => navigate(`/hiring/${gig.id}`)}
                  aria-label={`View ${gig.title}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-m3-on-surface truncate">
                      {gig.title.length > 40 ? `${gig.title.slice(0, 40)}...` : gig.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StageBadge gig={gig} />
                      <span className="text-xs text-m3-on-surface-variant">
                        {formatRelativeTime(gig.updated_at)}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-m3-on-surface-variant mb-3">
              No recent activity yet. Post your first gig to get started.
            </p>
            <Button variant="filled" size="sm" onClick={() => navigate('/hiring/new')}>
              Post a Gig
            </Button>
          </div>
        )}
      </CardContent>

      {hasItems && (
        <CardFooter>
          <Button
            variant="text"
            size="sm"
            onClick={() => navigate('/dashboard/recent')}
          >
            View all
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
