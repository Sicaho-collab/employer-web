import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/ui/PageHeader'
import GigListView from './GigListView'
import type { GigViewTab, Gig } from '@/types/gig'
import { GigStage, OfferStatus, PaymentStatus, TimesheetStatus, ErrorStatus } from '@/types/gig'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// View tabs per IA spec
const VIEW_TABS: { id: GigViewTab; label: string }[] = [
  { id: 'ALL',    label: 'All'    },
  { id: 'DRAFT',  label: 'Draft'  },
  { id: 'POSTED', label: 'Posted' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'DONE',   label: 'Done'   },
  { id: 'CLOSED', label: 'Closed' },
]

// Placeholder gig data — replace with API fetch
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
    payment_status: PaymentStatus.AUTHORISED,
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
  {
    id: 'g5', title: 'Social Media Manager', stage: GigStage.POSTED,
    description: 'Draft content calendar',
    is_published: false,    // Draft
    offer_status: OfferStatus.NONE,
    payment_status: PaymentStatus.NOT_REQUIRED,
    timesheet_status: TimesheetStatus.NOT_REQUIRED,
    error_status: ErrorStatus.NONE,
    applicant_count: 0,
    created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z',
  },
]

// Count per tab for badges
type TabCounts = Record<GigViewTab, number>

export default function HiringPage() {
  const navigate   = useNavigate()
  const [activeTab, setActiveTab] = useState<GigViewTab>('ALL')

  const counts: TabCounts = {
    ALL:    PLACEHOLDER_GIGS.length,
    DRAFT:  PLACEHOLDER_GIGS.filter(g => g.stage === GigStage.POSTED && !g.is_published).length,
    POSTED: PLACEHOLDER_GIGS.filter(g => g.stage === GigStage.POSTED  &&  g.is_published).length,
    ACTIVE: PLACEHOLDER_GIGS.filter(g => g.stage === GigStage.ACTIVE).length,
    DONE:   PLACEHOLDER_GIGS.filter(g => g.stage === GigStage.DONE).length,
    CLOSED: PLACEHOLDER_GIGS.filter(g => g.stage === GigStage.CLOSED).length,
  }

  const tabs = VIEW_TABS.map(t => ({ ...t, count: counts[t.id] }))

  return (
    <div className="max-w-[var(--content-max-w)] mx-auto px-4 md:px-6 py-6 md:py-8">
      <PageHeader
        title="Hiring"
        subtitle="Manage your gigs across the full lifecycle."
        actions={
          <Button onClick={() => navigate('/hiring/new')}>Post a Gig</Button>
        }
      />

      {/* ── View Tabs ── */}
      <div className="flex items-center border-b border-m3-surface-container-highest overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative inline-flex items-center gap-2 px-4 md:px-6 py-3.5 text-sm font-medium whitespace-nowrap",
              "transition-all duration-200 ease-out",
              "hover:bg-m3-on-surface/8 active:scale-[0.97] focus-visible:outline-none",
              activeTab === tab.id
                ? "text-m3-primary border-b-[3px] border-m3-primary -mb-px"
                : "text-m3-on-surface-variant hover:text-m3-on-surface"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium",
                  activeTab === tab.id
                    ? "bg-m3-primary text-white"
                    : "bg-m3-surface-container-high text-m3-on-surface-variant"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Gig Grid ── */}
      <div className="min-h-[300px] mt-6">
        <GigListView activeTab={activeTab} gigs={PLACEHOLDER_GIGS} />
      </div>
    </div>
  )
}
