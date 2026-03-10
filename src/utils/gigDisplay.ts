// ─────────────────────────────────────────────────────────────────────────────
// GIG DISPLAY UTILITIES
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

  // Posted (published, awaiting applications)
  if (gig.stage === GigStage.POSTED) {
    return { label: 'Posted', color: '#92400E', bg: '#FEF3C7' }
  }

  // Matched + start date in the future → "Starting Soon"
  if (
    gig.stage === GigStage.MATCHED &&
    gig.start_date &&
    new Date(gig.start_date) > new Date()
  ) {
    return { label: 'Starting Soon', color: '#1E40AF', bg: '#DBEAFE' }
  }

  // Matched (start date past or missing — gig is underway or date unset)
  if (gig.stage === GigStage.MATCHED) {
    return { label: 'Matched', color: '#1E40AF', bg: '#DBEAFE' }
  }

  // Active → "In Progress"
  if (gig.stage === GigStage.ACTIVE) {
    return { label: 'In Progress', color: '#065F46', bg: '#D1FAE5' }
  }

  // Done → "Completed"
  if (gig.stage === GigStage.DONE) {
    return { label: 'Completed', color: '#4C1D95', bg: '#EDE9FE' }
  }

  // Closed
  return { label: 'Closed', color: '#334155', bg: '#F1F5F9' }
}

// Convenience wrapper — returns only the display label
export function getGigDisplayLabel(gig: Gig): string {
  return getGigDisplayConfig(gig).label
}

// ── Primary CTA ───────────────────────────────────────────────────────────────

// Returns the contextual primary CTA label for the current gig state.
// For DONE gigs the label reflects the payment sub-layer, not just the stage.
export function getGigCTA(gig: Gig): string {
  if (gig.stage === GigStage.DONE) {
    return DONE_PAYMENT_CTA[gig.payment_status]
  }
  return GIG_STAGE_CTA[gig.stage]
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
