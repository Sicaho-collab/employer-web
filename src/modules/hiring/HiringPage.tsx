import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/ui/PageHeader'
import GigListView from './GigListView'
import type { GigViewTab, Gig } from '@/types/gig'
import { GigStage, OfferStatus, PaymentStatus, TimesheetStatus, ErrorStatus } from '@/types/gig'
import { getNeedsAttentionItems } from '@/utils/gigDisplay'
import { Button, VerticalNavStepper, Icon } from '@sicaho-collab/ui-web'
import { cn } from '@/lib/utils'

// ── Nav step definitions — V3 lifecycle stages ──────────────────────────────

const NAV_STEPS: { label: string; description: string }[] = [
  { label: 'Draft',              description: 'Gigs not yet published' },
  { label: 'Hiring',             description: 'Live and accepting applications' },
  { label: 'Talent Secured',     description: 'Matched with a student' },
  { label: 'Gig In Progress',    description: 'Work has started' },
  { label: 'Gig Completed',      description: 'Work done, awaiting payment' },
  { label: 'Engagement Closed',  description: 'Fully settled and archived' },
]

// Map stepper index (0-based) to GigViewTab
const STEP_TO_TAB: GigViewTab[] = [
  'DRAFT',
  'HIRING',
  'SECURED',
  'IN_PROGRESS',
  'COMPLETED',
  'CLOSED',
]

// ── Realistic mock data across all V3 lifecycle stages ───────────────────────

const PLACEHOLDER_GIGS: Gig[] = [
  // Draft
  {
    id: 'g1', title: 'Social Media Manager', stage: GigStage.POSTED,
    description: 'Draft content calendar and manage channels.',
    is_published: false,
    offer_status: OfferStatus.NONE,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 0,
    created_at: '2026-02-20T00:00:00Z', updated_at: '2026-02-22T00:00:00Z',
  },
  // Hiring (POSTED, published) — with applicants
  {
    id: 'g2', title: 'Copywriter', stage: GigStage.POSTED,
    description: 'Write product descriptions for new launch.',
    is_published: true,
    offer_status: OfferStatus.NONE,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 8,
    start_date: '2026-04-01', end_date: '2026-06-01',
    created_at: '2026-02-28T00:00:00Z', updated_at: '2026-03-05T00:00:00Z',
  },
  // Hiring — fresh post, no applicants yet
  {
    id: 'g3', title: 'Data Entry Specialist', stage: GigStage.POSTED,
    description: 'Migrate records to new CRM.',
    is_published: true,
    offer_status: OfferStatus.NONE,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 0,
    start_date: '2026-04-15', end_date: '2026-05-15',
    created_at: '2026-03-10T00:00:00Z', updated_at: '2026-03-10T00:00:00Z',
  },
  // Talent Secured (MATCHED) — offer sent, awaiting response
  {
    id: 'g4', title: 'Frontend Developer', stage: GigStage.MATCHED,
    description: 'Build UI components for employer dashboard.',
    is_published: true,
    offer_status: OfferStatus.SENT,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 12, matched_student_id: 'u1',
    start_date: '2026-04-01', end_date: '2026-06-01',
    created_at: '2026-01-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z',
  },
  // Talent Secured — offer accepted, starting soon
  {
    id: 'g5', title: 'Graphic Designer', stage: GigStage.MATCHED,
    description: 'Create brand assets for Q2 campaign.',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.AUTHORISED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 6, matched_student_id: 'u4',
    start_date: '2026-03-20', end_date: '2026-05-20',
    created_at: '2026-02-01T00:00:00Z', updated_at: '2026-03-08T00:00:00Z',
  },
  // Gig In Progress (ACTIVE) — timesheet submitted
  {
    id: 'g6', title: 'UX Researcher', stage: GigStage.ACTIVE,
    description: 'Conduct user interviews and synthesise findings.',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.AUTHORISED,
    timesheet_status: TimesheetStatus.SUBMITTED,
    error_status: ErrorStatus.NONE,
    applicant_count: 7, matched_student_id: 'u2',
    start_date: '2026-02-01', end_date: '2026-04-01',
    created_at: '2026-01-05T00:00:00Z', updated_at: '2026-03-10T00:00:00Z',
  },
  // Gig In Progress — timesheet overdue
  {
    id: 'g7', title: 'Content Strategist', stage: GigStage.ACTIVE,
    description: 'Develop content roadmap for H2.',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.AUTHORISED,
    timesheet_status: TimesheetStatus.OVERDUE,
    error_status: ErrorStatus.NONE,
    applicant_count: 4, matched_student_id: 'u5',
    start_date: '2026-01-15', end_date: '2026-03-15',
    created_at: '2025-12-20T00:00:00Z', updated_at: '2026-03-08T00:00:00Z',
  },
  // Gig Completed (DONE) — awaiting payment release
  {
    id: 'g8', title: 'Data Analyst', stage: GigStage.DONE,
    description: 'Analyse survey data and produce insights report.',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.AUTHORISED,
    timesheet_status: TimesheetStatus.APPROVED,
    error_status: ErrorStatus.NONE,
    applicant_count: 5, matched_student_id: 'u3',
    start_date: '2025-12-01', end_date: '2026-01-31',
    created_at: '2025-11-20T00:00:00Z', updated_at: '2026-02-15T00:00:00Z',
  },
  // Closed — Paid
  {
    id: 'g9', title: 'Marketing Assistant', stage: GigStage.CLOSED,
    description: 'Supported Q4 marketing campaigns.',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.CAPTURED,
    timesheet_status: TimesheetStatus.APPROVED,
    error_status: ErrorStatus.NONE,
    applicant_count: 3, matched_student_id: 'u6',
    start_date: '2025-10-01', end_date: '2025-12-15',
    created_at: '2025-09-15T00:00:00Z', updated_at: '2026-01-10T00:00:00Z',
  },
  // Closed — with payment failure (error state)
  {
    id: 'g10', title: 'Video Editor', stage: GigStage.DONE,
    description: 'Edit promotional videos for product launch.',
    is_published: true,
    offer_status: OfferStatus.ACCEPTED,
    payment_status: PaymentStatus.FAILED,
    timesheet_status: TimesheetStatus.APPROVED,
    error_status: ErrorStatus.PAYMENT_FAILED,
    applicant_count: 2, matched_student_id: 'u7',
    start_date: '2025-11-01', end_date: '2026-01-15',
    created_at: '2025-10-20T00:00:00Z', updated_at: '2026-02-20T00:00:00Z',
  },
]

// ── Severity config for attention items ──────────────────────────────────────

const SEVERITY_STYLES: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  error:   { border: 'border-red-200',    bg: 'bg-red-50',    text: 'text-red-800',    icon: '!' },
  warning: { border: 'border-amber-200',  bg: 'bg-amber-50',  text: 'text-amber-800',  icon: '!' },
  info:    { border: 'border-blue-200',   bg: 'bg-blue-50',   text: 'text-blue-800',   icon: 'i' },
}

// ── Gig count per step ──────────────────────────────────────────────────────

function computeStepCounts(gigs: Gig[]): number[] {
  return [
    gigs.filter(g => g.stage === GigStage.POSTED && !g.is_published).length,  // Draft
    gigs.filter(g => g.stage === GigStage.POSTED && g.is_published).length,   // Hiring
    gigs.filter(g => g.stage === GigStage.MATCHED).length,                    // Secured
    gigs.filter(g => g.stage === GigStage.ACTIVE).length,                     // In Progress
    gigs.filter(g => g.stage === GigStage.DONE).length,                       // Completed
    gigs.filter(g => g.stage === GigStage.CLOSED).length,                     // Closed
  ]
}

// ═════════════════════════════════════════════════════════════════════════════
// HiringPage — V3 Employer Command Center (Split Layout with Stepper Nav)
// ═════════════════════════════════════════════════════════════════════════════

export default function HiringPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)

  const activeTab: GigViewTab = STEP_TO_TAB[activeStep]
  const attentionItems = getNeedsAttentionItems(PLACEHOLDER_GIGS)
  const stepCounts = computeStepCounts(PLACEHOLDER_GIGS)

  const navSteps = NAV_STEPS.map((step, i) => ({
    ...step,
    count: stepCounts[i] || undefined,
  }))

  return (
    <div className="max-w-[var(--content-max-w)] mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* ── Page Header ── */}
      <PageHeader
        title="My Gigs"
        subtitle="Your command center — manage gigs across the full lifecycle."
        actions={
          <Button onClick={() => navigate('/hiring/new')}>
            <Icon name="add" /> Post a Gig
          </Button>
        }
      />

      {/* ── Needs Attention Banner (full width, above split) ── */}
      {attentionItems.length > 0 && (
        <div
          role="alert"
          className="mb-6 rounded-m3-md border border-m3-outline-variant bg-m3-surface-container-lowest p-4"
        >
          <h2 className="text-sm font-semibold text-m3-on-surface mb-3">
            Needs Your Attention
          </h2>
          <div className="flex flex-col gap-2">
            {attentionItems.map(item => {
              const sev = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.info
              return (
                <div
                  key={item.type}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2.5 rounded-m3-xs border",
                    sev.border, sev.bg
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                        item.severity === 'error' ? 'bg-red-200 text-red-800' :
                        item.severity === 'warning' ? 'bg-amber-200 text-amber-800' :
                        'bg-blue-200 text-blue-800'
                      )}
                      aria-hidden
                    >
                      {sev.icon}
                    </span>
                    <span className={cn("text-sm font-medium", sev.text)}>
                      {item.message}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (item.gigIds[0]) navigate(`/hiring/${item.gigIds[0]}`)
                    }}
                    className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-m3-full border transition-colors",
                      sev.border, sev.text,
                      "hover:bg-white/60"
                    )}
                  >
                    Review
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Split Layout: Stepper (left) + Content (right) ── */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Left: Vertical Stepper Navigation ── */}
        <aside
          className={cn(
            "w-full md:w-1/4 md:min-w-[220px] flex-shrink-0",
            "rounded-m3-md border border-m3-outline-variant/40",
            "bg-m3-surface-container-lowest p-4"
          )}
        >
          <VerticalNavStepper
            steps={navSteps}
            activeIndex={activeStep}
            onStepClick={setActiveStep}
          />
        </aside>

        {/* ── Right: Gig Content Area ── */}
        <main className="flex-1 min-w-0">

          {/* ── Stage Header ── */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-m3-on-surface">
              {NAV_STEPS[activeStep].label}
            </h2>
            <p className="text-sm text-m3-on-surface-variant">
              {NAV_STEPS[activeStep].description}
            </p>
          </div>

          {/* ── Gig List ── */}
          <div className="min-h-[300px]">
            <GigListView activeTab={activeTab} gigs={PLACEHOLDER_GIGS} />
          </div>
        </main>
      </div>
    </div>
  )
}
