import { Outlet, useParams, useNavigate, NavLink } from 'react-router-dom'
import type { Gig } from '@/types/gig'
import { GigStage, OfferStatus, PaymentStatus, TimesheetStatus, ErrorStatus } from '@/types/gig'
import StageBadge from '@/components/ui/StageBadge'
import PaymentStatusBadge from '@/components/ui/PaymentStatusBadge'
import { getGigCTA } from '@/utils/gigDisplay'

// Gig detail tabs per IA spec
const DETAIL_TABS = [
  { path: 'overview',     label: 'Overview'     },
  { path: 'applications', label: 'Applications' },
  { path: 'agreement',    label: 'Agreement'    },
  { path: 'payment',      label: 'Payment'      },
  { path: 'activity',     label: 'Activity Log' },
] as const

// Placeholder gig — replace with param-based fetch
const PLACEHOLDER_GIG: Gig = {
  id: 'g1',
  title: 'Frontend Developer',
  description: 'Build and maintain UI components for the product team.',
  stage: GigStage.DONE,
  is_published: true,
  offer_status: OfferStatus.ACCEPTED,
  payment_status: PaymentStatus.AUTHORISED,
  timesheet_status: TimesheetStatus.APPROVED,
  error_status: ErrorStatus.NONE,
  applicant_count: 12,
  matched_student_id: 'u1',
  start_date: '2025-02-01',
  end_date: '2025-04-01',
  created_at: '2025-01-15T00:00:00Z',
  updated_at: '2025-01-20T00:00:00Z',
}

export default function GigDetailPage() {
  const { gigId }  = useParams<{ gigId: string }>()
  const navigate   = useNavigate()
  const gig        = PLACEHOLDER_GIG // TODO: fetch by gigId
  const ctaLabel   = getGigCTA(gig)

  void gigId // will be used in real fetch

  return (
    <div style={styles.page}>
      {/* ── Breadcrumb ── */}
      <button style={styles.back} onClick={() => navigate('/hiring')}>
        ← All Gigs
      </button>

      {/* ── Gig Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {/* Badge row — stage (primary) + payment sub-status (secondary) */}
          <div style={styles.badges}>
            <StageBadge gig={gig} />
            <PaymentStatusBadge status={gig.payment_status} />
          </div>
          <h1 style={styles.title}>{gig.title}</h1>
          <p style={styles.description}>{gig.description}</p>

          {/* Timeline */}
          {gig.start_date && (
            <p style={styles.timeline}>
              📅 {gig.start_date} → {gig.end_date ?? 'TBD'}
            </p>
          )}
        </div>

        {/* Primary CTA — always visible, contextual to stage */}
        <button style={styles.primaryCta}>
          {ctaLabel} →
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <nav style={styles.tabNav}>
        {DETAIL_TABS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) =>
              isActive ? { ...styles.tab, ...styles.tabActive } : styles.tab
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Tab Content ── */}
      <div style={styles.tabContent}>
        <Outlet />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 'var(--content-max-w)',
    margin: '0 auto',
    padding: 'var(--space-6) var(--space-4)',
  },
  back: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginBottom: 'var(--space-5)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--space-4)',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    marginBottom: 'var(--space-6)',
    boxShadow: 'var(--shadow-sm)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
  },
  description: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
  },
  timeline: {
    fontSize: 14,
    color: 'var(--color-text-muted)',
    marginTop: 'var(--space-1)',
  },
  primaryCta: {
    flexShrink: 0,
    padding: 'var(--space-3) var(--space-6)',
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabNav: {
    display: 'flex',
    gap: 'var(--space-1)',
    borderBottom: '1px solid var(--color-border)',
    marginBottom: 'var(--space-6)',
    overflowX: 'auto',
  },
  tab: {
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: -1,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--color-primary)',
    borderBottomColor: 'var(--color-primary)',
    fontWeight: 600,
  },
  tabContent: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    boxShadow: 'var(--shadow-sm)',
    minHeight: 300,
  },
}
