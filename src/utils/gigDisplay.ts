// ─────────────────────────────────────────────────────────────────────────────
// GIG DISPLAY UTILITIES — V3 Lifecycle Model
// All UI-facing labels, colours, CTAs, and attention states are derived here.
// Components must NEVER apply their own stage→label mapping; use these helpers.
// ─────────────────────────────────────────────────────────────────────────────

import type { Gig } from '@/types/gig'
import {
  GigStage,
  OfferStatus,
  PaymentStatus,
  TimesheetStatus,
  ErrorStatus,
  GIG_STAGE_CTA,
  DONE_PAYMENT_CTA,
} from '@/types/gig'

// ── Display config (badge label + colours) ────────────────────────────────────

export interface GigDisplayConfig {
  label: string
  color: string
  bg: string
}

// Derived display state — computed from stage + sub-layers.
// Order of precedence matters: check draft/special cases before raw stage.
export function getGigDisplayConfig(gig: Gig): GigDisplayConfig {
  // Draft: POSTED but not yet published
  if (gig.stage === GigStage.POSTED && !gig.is_published) {
    return { label: 'Draft', color: '#64748B', bg: '#F8FAFC' }
  }

  // Hiring: POSTED + published
  if (gig.stage === GigStage.POSTED) {
    return { label: 'Hiring', color: '#92400E', bg: '#FEF3C7' }
  }

  // Gig Starting Soon: MATCHED + start_date in the future
  if (
    gig.stage === GigStage.MATCHED &&
    gig.start_date &&
    new Date(gig.start_date) > new Date()
  ) {
    return { label: 'Gig Starting Soon', color: '#1E40AF', bg: '#DBEAFE' }
  }

  // Talent Secured: MATCHED (start date past or missing)
  if (gig.stage === GigStage.MATCHED) {
    return { label: 'Talent Secured', color: '#1E40AF', bg: '#DBEAFE' }
  }

  // Gig In Progress: ACTIVE
  if (gig.stage === GigStage.ACTIVE) {
    return { label: 'Gig In Progress', color: '#065F46', bg: '#D1FAE5' }
  }

  // Gig Completed: DONE
  if (gig.stage === GigStage.DONE) {
    return { label: 'Gig Completed', color: '#4C1D95', bg: '#EDE9FE' }
  }

  // Closed — refine by payment_status
  if (gig.stage === GigStage.CLOSED) {
    if (gig.payment_status === PaymentStatus.CAPTURED) {
      return { label: 'Paid', color: '#065F46', bg: '#D1FAE5' }
    }
    if (gig.payment_status === PaymentStatus.REFUNDED) {
      return { label: 'Refunded', color: '#92400E', bg: '#FEF3C7' }
    }
    return { label: 'Engagement Closed', color: '#334155', bg: '#F1F5F9' }
  }

  return { label: 'Unknown', color: '#334155', bg: '#F1F5F9' }
}

// Convenience wrapper — returns only the display label
export function getGigDisplayLabel(gig: Gig): string {
  return getGigDisplayConfig(gig).label
}

// ── Primary CTA ───────────────────────────────────────────────────────────────

// Returns the contextual primary CTA label for the current gig state.
// V3: For DONE gigs the label reflects the payment sub-layer.
// V3: For ACTIVE gigs the CTA is "Mark as Complete" — prominent, not buried.
export function getGigCTA(gig: Gig): string {
  // Draft → finish editing
  if (gig.stage === GigStage.POSTED && !gig.is_published) {
    return 'Continue Editing'
  }
  if (gig.stage === GigStage.DONE) {
    return DONE_PAYMENT_CTA[gig.payment_status]
  }
  return GIG_STAGE_CTA[gig.stage]
}

// ── Offer display config ─────────────────────────────────────────────────────

export function getOfferDisplayConfig(gig: Gig): { label: string; color: string; bg: string } | null {
  switch (gig.offer_status) {
    case OfferStatus.SENT:
      return { label: 'Offer Awaiting', color: '#92400E', bg: '#FEF3C7' }
    case OfferStatus.ACCEPTED:
      return { label: 'Offer Accepted', color: '#065F46', bg: '#D1FAE5' }
    case OfferStatus.EXPIRED:
      return { label: 'Offer Expired', color: '#7F1D1D', bg: '#FEE2E2' }
    case OfferStatus.CANCELLED:
      return { label: 'Offer Cancelled', color: '#64748B', bg: '#F1F5F9' }
    case OfferStatus.DECLINED:
      return { label: 'Offer Declined', color: '#7F1D1D', bg: '#FEE2E2' }
    default:
      return null
  }
}

// ── Attention info ────────────────────────────────────────────────────────────

export interface GigAttentionInfo {
  hasError: boolean
  message: string
}

// Error messages per ErrorStatus (NONE is never surfaced — guard above)
const ERROR_STATUS_MESSAGE: Record<ErrorStatus, string> = {
  [ErrorStatus.NONE]:              '',
  [ErrorStatus.PAYMENT_FAILED]:    'Payment failed — action required',
  [ErrorStatus.PAYOUT_FAILED]:     'Student payout failed — contact support',
  [ErrorStatus.DATA_INCONSISTENT]: 'Data issue detected — contact support',
  [ErrorStatus.SYSTEM_ERROR]:      'System error — contact support',
}

// Derives whether a gig needs employer attention and what the message is.
// Checks error_status first, then payment sub-layer anomalies.
export function getGigAttentionInfo(gig: Gig): GigAttentionInfo {
  if (gig.error_status !== ErrorStatus.NONE) {
    return { hasError: true, message: ERROR_STATUS_MESSAGE[gig.error_status] }
  }
  if (gig.payment_status === PaymentStatus.FAILED) {
    return { hasError: true, message: 'Payment failed — retry required' }
  }
  if (gig.payment_status === PaymentStatus.DISPUTED) {
    return { hasError: true, message: 'Payment under dispute — review required' }
  }
  return { hasError: false, message: '' }
}

// ── Attention message ───────────────────────────────────────────────────────

// Derives a human-readable attention message from the gig's status layers.
// Priority: error_status -> offer -> timesheet -> payment -> applicants.
export function getAttentionMessage(gig: Gig): string {
  const { hasError, message } = getGigAttentionInfo(gig)
  if (hasError) return message

  if (gig.offer_status === OfferStatus.SENT) {
    return 'Offer pending — awaiting student response'
  }
  if (gig.timesheet_status === TimesheetStatus.SUBMITTED) {
    return 'Timesheet submitted — awaiting your approval'
  }
  if (gig.timesheet_status === TimesheetStatus.OVERDUE) {
    return 'Timesheet overdue — follow up with student'
  }
  if (gig.payment_status === PaymentStatus.NOT_REQUIRED && gig.stage === GigStage.DONE) {
    return 'Payment not yet released'
  }
  if (gig.stage === GigStage.POSTED && gig.is_published && gig.applicant_count > 0) {
    return `${gig.applicant_count} new applicant${gig.applicant_count === 1 ? '' : 's'} to review`
  }
  return 'Requires your attention'
}

// ── Needs Attention aggregation (dashboard-level) ───────────────────────────

export interface NeedsAttentionItem {
  type: 'offers_awaiting' | 'payment_failed' | 'timesheet_overdue'
  message: string
  count: number
  severity: 'warning' | 'error' | 'info'
  gigIds: string[]
}

// Aggregates all gigs to produce dashboard-level "needs attention" items.
// V3: Surface these prominently as a banner on the hiring page.
export function getNeedsAttentionItems(gigs: Gig[]): NeedsAttentionItem[] {
  const items: NeedsAttentionItem[] = []

  // Offers awaiting response
  const offersAwaiting = gigs.filter(g => g.offer_status === OfferStatus.SENT)
  if (offersAwaiting.length > 0) {
    items.push({
      type: 'offers_awaiting',
      message: `${offersAwaiting.length} offer${offersAwaiting.length === 1 ? '' : 's'} awaiting response`,
      count: offersAwaiting.length,
      severity: 'warning',
      gigIds: offersAwaiting.map(g => g.id),
    })
  }

  // Payment failures
  const paymentFailed = gigs.filter(
    g => g.payment_status === PaymentStatus.FAILED ||
         g.error_status === ErrorStatus.PAYMENT_FAILED
  )
  if (paymentFailed.length > 0) {
    items.push({
      type: 'payment_failed',
      message: 'Payment failed — action required',
      count: paymentFailed.length,
      severity: 'error',
      gigIds: paymentFailed.map(g => g.id),
    })
  }

  // Overdue timesheets
  const timesheetOverdue = gigs.filter(
    g => g.timesheet_status === TimesheetStatus.OVERDUE
  )
  if (timesheetOverdue.length > 0) {
    items.push({
      type: 'timesheet_overdue',
      message: `Timesheet overdue — ${timesheetOverdue.length} gig${timesheetOverdue.length === 1 ? '' : 's'}`,
      count: timesheetOverdue.length,
      severity: 'error',
      gigIds: timesheetOverdue.map(g => g.id),
    })
  }

  return items
}

// ── Stage count helpers ─────────────────────────────────────────────────────

export interface StageSummary {
  label: string
  count: number
  color: string
  bg: string
  tabId: string
}

// Returns summary counts per V3 computed label for the overview section.
export function getStageSummary(gigs: Gig[]): StageSummary[] {
  return [
    {
      label: 'Draft',
      count: gigs.filter(g => g.stage === GigStage.POSTED && !g.is_published).length,
      color: '#64748B', bg: '#F8FAFC', tabId: 'DRAFT',
    },
    {
      label: 'Hiring',
      count: gigs.filter(g => g.stage === GigStage.POSTED && g.is_published).length,
      color: '#92400E', bg: '#FEF3C7', tabId: 'HIRING',
    },
    {
      label: 'Talent Secured',
      count: gigs.filter(g => g.stage === GigStage.MATCHED).length,
      color: '#1E40AF', bg: '#DBEAFE', tabId: 'SECURED',
    },
    {
      label: 'In Progress',
      count: gigs.filter(g => g.stage === GigStage.ACTIVE).length,
      color: '#065F46', bg: '#D1FAE5', tabId: 'IN_PROGRESS',
    },
    {
      label: 'Completed',
      count: gigs.filter(g => g.stage === GigStage.DONE).length,
      color: '#4C1D95', bg: '#EDE9FE', tabId: 'COMPLETED',
    },
    {
      label: 'Closed',
      count: gigs.filter(g => g.stage === GigStage.CLOSED).length,
      color: '#334155', bg: '#F1F5F9', tabId: 'CLOSED',
    },
  ]
}
