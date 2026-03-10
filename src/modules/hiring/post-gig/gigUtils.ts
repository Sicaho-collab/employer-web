// ─────────────────────────────────────────────────────────────────────────────
//  Post-Gig Wizard — shared types, budget utilities, AI simulation
// ─────────────────────────────────────────────────────────────────────────────

// ── Skill types ──────────────────────────────────────────────────────────────
//
//  Level is stored as a number so it can be sent directly to the matching API.
//  The UI always shows the human-readable label via SKILL_LEVEL_LABEL.
//
export type SkillLevel = 1 | 2 | 3   // 1 = Beginner · 2 = Intermediate · 3 = Advanced

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
}

export interface SkillEntry {
  skill: string    // human-readable skill name
  level: SkillLevel
}

// ── Central wizard state ──────────────────────────────────────────────────────

export interface WizardState {
  // AI entry input
  rawDescription:     string

  // Step 1 — Details (AI-generated, editable)
  aiTitle:            string
  aiDescription:      string
  skills:             SkillEntry[]
  workCategory:       string

  // Step 2 — Timeline
  startDate:          string
  endDate:            string
  applicationDeadline: string

  // Step 3 — Budget
  budget:             string   // raw string, e.g. "1200"

  // Step 4 — Preferences
  workMode:           string
  additionalNotes:    string

  // Step 5 — Review & Publish (approval)
  approverName:       string
  approverEmail:      string
  isInternalApproved:   boolean
  isComplianceConfirmed: boolean
  isTermsAgreed:        boolean

  // Generated on publish
  gigId: string
}

export const INITIAL_WIZARD_STATE: WizardState = {
  rawDescription:      '',
  aiTitle:             '',
  aiDescription:       '',
  skills:              [],
  workCategory:        '',
  startDate:           '',
  endDate:             '',
  applicationDeadline: '',
  budget:              '',
  workMode:            'Remote',
  additionalNotes:     '',
  approverName:        '',
  approverEmail:       '',
  isInternalApproved:   false,
  isComplianceConfirmed: false,
  isTermsAgreed:        false,
  gigId:               '',
}

// ── Budget utilities ──────────────────────────────────────────────────────────
//
//  Fee structure (all extracted from the employer's total — no surprise charges):
//    Processing fee  =  1.5%  of total
//    Platform fee    = 12.0%  of total
//    GST             = 10.0%  of platform fee  (= 1.2% of total)
//    Student pay     = remainder  (85.3% of total)
//
export const PROCESSING_FEE_RATE = 0.015          // 1.5%
export const PLATFORM_FEE_RATE   = 0.12           // 12%
export const GST_RATE            = 0.10           // 10% of platform fee
export const FLOOR_HOURLY_RATE   = 32             // legal minimum rate — fixed, never reverse-calculated

// Effective student share = 1 − 0.015 − 0.12 − (0.12 × 0.10) = 0.853
const STUDENT_SHARE = 1 - PROCESSING_FEE_RATE - PLATFORM_FEE_RATE - (PLATFORM_FEE_RATE * GST_RATE)

export interface BudgetBreakdown {
  total:          number   // exactly what the employer typed
  processingFee:  number   // 1.5% of total
  platformFee:    number   // 12% of total
  gst:            number   // 10% of platform fee
  studentPay:     number   // remainder
  effectiveRate:  number   // studentPay / maxHours
  maxHours:       number   // floor(studentPay / FLOOR_HOURLY_RATE)
}

/** Returns null if budgetStr is not a valid positive number. */
export function calcBudget(budgetStr: string): BudgetBreakdown | null {
  const total = parseFloat(budgetStr)
  if (isNaN(total) || total <= 0) return null

  const r = (n: number) => Math.round(n * 100) / 100   // round to 2dp

  const processingFee = r(total * PROCESSING_FEE_RATE)
  const platformFee   = r(total * PLATFORM_FEE_RATE)
  const gst           = r(platformFee * GST_RATE)
  const studentPay    = r(total - processingFee - platformFee - gst)
  const maxHours      = Math.floor(studentPay / FLOOR_HOURLY_RATE)
  const effectiveRate = maxHours > 0 ? r(studentPay / maxHours) : 0

  return { total, processingFee, platformFee, gst, studentPay, effectiveRate, maxHours }
}

/** Minimum budget to support at least one minimum-rate hour. */
export function calcMinBudget(): number {
  return Math.ceil(FLOOR_HOURLY_RATE / STUDENT_SHARE)
}

/** Format a number as AUD currency string, e.g. "$1,200.00". */
export function fmt(n: number): string {
  return n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 })
}

// ── Gig ID generation ─────────────────────────────────────────────────────────

export function generateGigId(): string {
  return 'GIG-' + Date.now().toString(36).toUpperCase().slice(-6)
}

// ── Simulated AI generation ───────────────────────────────────────────────────

type AIResult = Pick<WizardState, 'aiTitle' | 'aiDescription' | 'skills' | 'workCategory'>

/** Keyword → category map for simple categorisation. */
const CATEGORY_MAP: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['design', 'figma', 'ui', 'ux', 'wireframe', 'prototype', 'visual'],
    category: 'Design' },
  { keywords: ['code', 'develop', 'engineer', 'react', 'vue', 'angular', 'typescript',
               'javascript', 'python', 'backend', 'frontend', 'api', 'database', 'sql'],
    category: 'Engineering' },
  { keywords: ['data', 'analyt', 'excel', 'tableau', 'power bi', 'survey', 'research',
               'insight', 'report'],
    category: 'Data & Analytics' },
  { keywords: ['market', 'content', 'copy', 'seo', 'social media', 'blog', 'email',
               'campaign', 'brand'],
    category: 'Marketing' },
  { keywords: ['finance', 'account', 'bookkeep', 'payroll', 'tax', 'invoice', 'reconcil'],
    category: 'Finance' },
  { keywords: ['write', 'edit', 'proof', 'document', 'technical writ'],
    category: 'Writing' },
  { keywords: ['admin', 'operation', 'coordinat', 'schedul', 'organis', 'manage'],
    category: 'Operations' },
]

function detectCategory(text: string): string {
  const lower = text.toLowerCase()
  for (const { keywords, category } of CATEGORY_MAP) {
    if (keywords.some(k => lower.includes(k))) return category
  }
  return 'General'
}

/** Skill presets keyed by category (levels are numeric: 1/2/3). */
const SKILL_PRESETS: Record<string, SkillEntry[]> = {
  'Design': [
    { skill: 'Figma',           level: 2 },
    { skill: 'Visual Design',   level: 2 },
    { skill: 'User Research',   level: 1 },
  ],
  'Engineering': [
    { skill: 'JavaScript / TypeScript', level: 2 },
    { skill: 'React',                   level: 2 },
    { skill: 'Git',                     level: 1 },
  ],
  'Data & Analytics': [
    { skill: 'Data Analysis',      level: 2 },
    { skill: 'Excel / Sheets',     level: 2 },
    { skill: 'Data Visualisation', level: 1 },
  ],
  'Marketing': [
    { skill: 'Copywriting',  level: 2 },
    { skill: 'SEO Basics',   level: 1 },
    { skill: 'Social Media', level: 2 },
  ],
  'Finance': [
    { skill: 'Bookkeeping',     level: 2 },
    { skill: 'Excel / Sheets',  level: 2 },
    { skill: 'Reconciliation',  level: 1 },
  ],
  'Writing': [
    { skill: 'Technical Writing',  level: 2 },
    { skill: 'Editing & Proofing', level: 2 },
    { skill: 'Research',           level: 1 },
  ],
  'Operations': [
    { skill: 'Project Coordination', level: 1 },
    { skill: 'Scheduling',           level: 1 },
    { skill: 'Documentation',        level: 2 },
  ],
  'General': [
    { skill: 'Communication',   level: 2 },
    { skill: 'Organisation',    level: 1 },
    { skill: 'Problem Solving', level: 1 },
  ],
}

/** Build a clean, structured description from the raw text. */
function structureDescription(raw: string): string {
  const trimmed = raw.trim()
  // Capitalise first letter, ensure ends with full stop
  const body = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  const ended = body.endsWith('.') || body.endsWith('?') || body.endsWith('!')
    ? body
    : body + '.'
  return (
    ended +
    '\n\nYou will collaborate closely with the team, deliver clear outputs, and manage your own schedule within the agreed timeframe.'
  )
}

/** Generate a concise title from the first meaningful sentence. */
function generateTitle(raw: string, category: string): string {
  const first = raw.split(/[.!?\n]/)[0].trim()
  if (first.length < 5) return `${category} Specialist`

  const words = first.split(/\s+/).slice(0, 6).join(' ')
  // Capitalise each word
  const titled = words.replace(/\b\w/g, c => c.toUpperCase())
  return titled
}

/**
 * Simulates an AI generation step.
 * Returns after a realistic delay (1.6–1.8 s).
 */
export async function simulateAI(raw: string): Promise<AIResult> {
  const delay = 1600 + Math.random() * 200
  await new Promise(resolve => setTimeout(resolve, delay))

  const category      = detectCategory(raw)
  const aiTitle       = generateTitle(raw, category)
  const aiDescription = structureDescription(raw)
  const skills        = SKILL_PRESETS[category] ?? SKILL_PRESETS['General']

  return { aiTitle, aiDescription, skills, workCategory: category }
}
