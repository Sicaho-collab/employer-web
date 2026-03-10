// Max 5 actionable items. Each item is a full Gig — message and CTA are derived.
import type { Gig } from '@/types/gig'
import {
  GigStage,
  OfferStatus,
  PaymentStatus,
  TimesheetStatus,
  ErrorStatus,
} from '@/types/gig'
import StageBadge from '@/components/ui/StageBadge'
import { getAttentionMessage, getGigCTA, getGigAttentionInfo } from '@/utils/gigDisplay'
import { useNavigate } from 'react-router-dom'

// Placeholder data — replace with real attention-flagged gig fetch
const PLACEHOLDER_GIGS: Gig[] = [
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
    created_at: '2025-01-15T00:00:00Z', updated_at: '2025-01-20T00:00:00Z',
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
    start_date: '2025-01-20', end_date: '2025-03-20',
    created_at: '2025-01-05T00:00:00Z', updated_at: '2025-01-22T00:00:00Z',
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
    start_date: '2024-12-01', end_date: '2025-01-31',
    created_at: '2024-11-20T00:00:00Z', updated_at: '2025-02-01T00:00:00Z',
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
    start_date: '2025-03-01', end_date: '2025-05-01',
    created_at: '2025-01-28T00:00:00Z', updated_at: '2025-01-28T00:00:00Z',
  },
]

export default function NeedsAttention() {
  const navigate = useNavigate()

  return (
    <section className="bg-m3-surface border border-m3-outline-variant rounded-m3-md p-5 shadow-m3-1">
      <h2 className="text-[var(--text-base)] font-bold text-m3-on-surface mb-4">
        Needs Attention
      </h2>
      <div className="flex flex-col gap-1">
        {PLACEHOLDER_GIGS.map((gig) => {
          const { hasError } = getGigAttentionInfo(gig)
          return (
            <div
              key={gig.id}
              className={`flex flex-wrap items-center justify-between p-3 rounded-m3-sm gap-3 transition-colors duration-100 ${
                hasError
                  ? 'bg-m3-error-container outline outline-1 outline-m3-error/30'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <StageBadge gig={gig} />
                <div>
                  <p className="text-[var(--text-sm)] font-semibold text-m3-on-surface">
                    {gig.title}
                  </p>
                  <p className="text-[11px] text-m3-on-surface-variant mt-px">
                    {getAttentionMessage(gig)}
                  </p>
                </div>
              </div>
              <button
                className={`px-3 py-2 border-none rounded-m3-sm text-[11px] font-semibold cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m3-primary ${
                  hasError
                    ? 'bg-m3-error/10 text-m3-on-error-container'
                    : 'bg-m3-primary/8 text-m3-primary'
                }`}
                onClick={() => navigate(`/hiring/${gig.id}`)}
              >
                {getGigCTA(gig)} &rarr;
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
