import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge, Icon } from '@sicaho-collab/ui-web'
import type { Gig } from '@/types/gig'
import {
  GigStage,
  OfferStatus,
  PaymentStatus,
  TimesheetStatus,
  ErrorStatus,
} from '@/types/gig'
import { getAttentionMessage, getGigCTA } from '@/utils/gigDisplay'

// Placeholder data — replace with real attention-flagged gigs query
const ATTENTION_GIGS: Gig[] = [
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

export default function AttentionCard() {
  const navigate = useNavigate()
  const hasItems = ATTENTION_GIGS.length > 0

  return (
    <Card variant="elevated" className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon name="warning" size={20} className="text-m3-primary shrink-0" />
        <CardTitle className="flex-1">Needs your attention</CardTitle>
        {hasItems && <Badge count={ATTENTION_GIGS.length} />}
      </CardHeader>

      <CardContent className="flex-1">
        {hasItems ? (
          <ul className="flex flex-col gap-2">
            {ATTENTION_GIGS.map((gig) => (
              <li key={gig.id}>
                <div className="flex items-start justify-between gap-2 rounded-m3-sm p-2 -mx-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-m3-on-surface truncate">
                      {gig.title}
                    </p>
                    <p className="text-xs text-m3-on-surface-variant mt-0.5">
                      {getAttentionMessage(gig)}
                    </p>
                  </div>
                  <Button
                    variant="outlined"
                    size="sm"
                    className="shrink-0 text-xs h-7 px-3"
                    onClick={() => navigate(`/hiring/${gig.id}`)}
                  >
                    {getGigCTA(gig)}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-4 gap-2">
            <Icon name="check_circle" size={32} className="text-m3-primary" />
            <p className="text-sm text-m3-on-surface-variant">
              You're all caught up!
            </p>
          </div>
        )}
      </CardContent>

      {hasItems && (
        <CardFooter>
          <Button
            variant="text"
            size="sm"
            onClick={() => navigate('/dashboard/attention')}
          >
            View all
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
