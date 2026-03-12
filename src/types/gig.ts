// ─────────────────────────────────────────────────────────────────────────────
// GIG LIFECYCLE — Single State Machine
// Stage is irreversible. Changes only via explicit events.
// ─────────────────────────────────────────────────────────────────────────────

export enum GigStage {
  POSTED  = 'POSTED',
  MATCHED = 'MATCHED',
  ACTIVE  = 'ACTIVE',
  DONE    = 'DONE',
  CLOSED  = 'CLOSED',
}

// ─────────────────────────────────────────────────────────────────────────────
// SECONDARY STATUS LAYERS — Independent state machines on the Gig entity.
// Do NOT merge into stage. Each layer transitions independently.
// Rule: if it has more than 2 states, model it as a status enum — not a flag.
// ─────────────────────────────────────────────────────────────────────────────

// Offer sub-layer — tracks the hiring offer lifecycle
export enum OfferStatus {
  NONE      = 'NONE',       // default; no offer initiated
  SENT      = 'SENT',       // offer sent to matched student
  ACCEPTED  = 'ACCEPTED',   // student accepted the offer
  DECLINED  = 'DECLINED',   // student declined the offer
  EXPIRED   = 'EXPIRED',    // offer window elapsed
  CANCELLED = 'CANCELLED',  // employer withdrew the offer
}

// Payment sub-layer — tracks the payment release lifecycle
export enum PaymentStatus {
  NOT_REQUIRED = 'NOT_REQUIRED', // default; payment not yet applicable
  AUTHORISED   = 'AUTHORISED',   // employer authorised the release
  CAPTURED     = 'CAPTURED',     // funds successfully disbursed
  FAILED       = 'FAILED',       // authorisation or capture failed
  REFUNDED     = 'REFUNDED',     // full or partial refund processed
  DISPUTED     = 'DISPUTED',     // payment under dispute
}

// Timesheet sub-layer — tracks work-hour verification lifecycle
export enum TimesheetStatus {
  NOT_REQUIRED = 'NOT_REQUIRED', // default; timesheet not applicable
  REQUIRED     = 'REQUIRED',     // timesheet must be submitted
  SUBMITTED    = 'SUBMITTED',    // student submitted hours
  APPROVED     = 'APPROVED',     // employer approved the hours
  REJECTED     = 'REJECTED',     // employer rejected — resubmission needed
  OVERDUE      = 'OVERDUE',      // deadline passed without submission
}

// Error sub-layer — surfaces system or operational errors on the Gig
export enum ErrorStatus {
  NONE               = 'NONE',               // default; no error
  PAYMENT_FAILED     = 'PAYMENT_FAILED',     // payment capture failed
  PAYOUT_FAILED      = 'PAYOUT_FAILED',      // payout to student failed
  DATA_INCONSISTENT  = 'DATA_INCONSISTENT',  // state machine integrity issue
  SYSTEM_ERROR       = 'SYSTEM_ERROR',       // unclassified system fault
}

export type CloseReason =
  | 'EXPIRED'
  | 'CANCELLED'
  | 'FILLED_EXTERNALLY'
  | 'NO_MATCH'

// ─────────────────────────────────────────────────────────────────────────────
// GIG — Primary entity. All sub-layers live directly on the Gig.
// Draft = stage POSTED + is_published false  (computed, never stored as stage)
// ─────────────────────────────────────────────────────────────────────────────

export interface Gig {
  id: string
  title: string
  description: string
  stage: GigStage
  is_published: boolean         // false = Draft
  offer_status: OfferStatus
  payment_status: PaymentStatus
  timesheet_status: TimesheetStatus
  error_status: ErrorStatus
  close_reason?: CloseReason
  applicant_count: number
  matched_student_id?: string
  posted_at?: string
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

// Derived view states (computed, never stored)
// V3 Lifecycle tabs — use computed labels, not raw stage names
export type GigViewTab =
  | 'ALL'
  | 'DRAFT'
  | 'HIRING'       // Stage = POSTED (published)
  | 'SECURED'      // Stage = MATCHED ("Talent Secured")
  | 'IN_PROGRESS'  // Stage = ACTIVE
  | 'COMPLETED'    // Stage = DONE
  | 'CLOSED'       // Stage = CLOSED

// Primary CTA per stage — drives action-first UX.
// For DONE, refine further by payment_status via getGigCTA() in utils/gigDisplay.ts
// V3: "Mark as Complete" is the prominent CTA on ACTIVE gigs — not buried in a sub-menu
export const GIG_STAGE_CTA: Record<GigStage, string> = {
  [GigStage.POSTED]:  'Review Applicants',
  [GigStage.MATCHED]: 'Send Offer',
  [GigStage.ACTIVE]:  'Mark as Complete',
  [GigStage.DONE]:    'Release Payment',
  [GigStage.CLOSED]:  'View Summary',
}

// CTA refinement for DONE stage based on payment sub-layer state
export const DONE_PAYMENT_CTA: Record<PaymentStatus, string> = {
  [PaymentStatus.NOT_REQUIRED]: 'Release Payment',
  [PaymentStatus.AUTHORISED]:   'Confirm Release',
  [PaymentStatus.CAPTURED]:     'View Receipt',
  [PaymentStatus.FAILED]:       'Retry Payment',
  [PaymentStatus.REFUNDED]:     'View Refund',
  [PaymentStatus.DISPUTED]:     'Resolve Dispute',
}

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE — All payments must reference a Gig
// ─────────────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  gig_id: string
  amount: number
  currency: string
  type: 'PAYMENT' | 'REFUND'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  created_at: string
}

export interface Invoice {
  id: string
  gig_id: string
  amount: number
  currency: string
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE'
  issued_at: string
  due_at: string
}

export interface Refund {
  id: string
  gig_id: string
  transaction_id: string
  amount: number
  reason: string
  status: 'REQUESTED' | 'APPROVED' | 'PROCESSED'
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY LOG — Append-only audit trail per Gig
// ─────────────────────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string
  gig_id: string
  event_type: string
  actor: 'EMPLOYER' | 'SYSTEM' | 'STUDENT'
  description: string
  metadata?: Record<string, unknown>
  occurred_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ORGANISATION
// ─────────────────────────────────────────────────────────────────────────────

export interface Organisation {
  id: string
  name: string
  logo_url?: string
  industry: string
  created_at: string
}

export interface TeamMember {
  id: string
  org_id: string
  name: string
  email: string
  role: 'ADMIN' | 'HIRING_MANAGER' | 'FINANCE'
  joined_at: string
}
