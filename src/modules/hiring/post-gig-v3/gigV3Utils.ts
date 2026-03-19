// ─────────────────────────────────────────────────────────────────────────────
//  Post-Gig V3 — AI generation, shared utils, tools options
// ─────────────────────────────────────────────────────────────────────────────

/** Predefined tool options for the Tools multi-select. */
export const TOOLS_OPTIONS = [
  'Google Analytics',
  'Excel',
  'Google Sheets',
  'Meta Ads Manager',
  'Canva',
  'Figma',
  'Slack',
  'Notion',
  'Trello',
  'HubSpot',
  'Mailchimp',
  'Adobe Creative Suite',
  'Power BI',
  'Tableau',
  'WordPress',
  'Shopify',
] as const

// ── Category detection (reused from legacy post-gig/gigUtils.ts) ────────────

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

// ── Action verb mapping by category ─────────────────────────────────────────

const TITLE_VERBS: Record<string, string> = {
  'Design': 'Design',
  'Engineering': 'Build',
  'Data & Analytics': 'Analyse',
  'Marketing': 'Drive',
  'Finance': 'Manage',
  'Writing': 'Create',
  'Operations': 'Coordinate',
  'General': 'Support',
}

// ── NLP Meta-Model cleaning ─────────────────────────────────────────────────

const VAGUE_PATTERNS = [
  /\b(basically|kind of|sort of|pretty much|more or less|i think|maybe|probably|just|really|very|actually|literally|stuff|things|etc)\b/gi,
  /\b(a bit|a lot|some|somehow|somewhat)\b/gi,
]

function cleanVagueLanguage(text: string): string {
  let cleaned = text
  for (const pattern of VAGUE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '')
  }
  // Collapse multiple spaces
  return cleaned.replace(/\s{2,}/g, ' ').trim()
}

// ── Title generation (Jobs-to-be-Done: [Verb] [Object] [Context]) ───────────

function generateV3Title(raw: string, category: string): string {
  const verb = TITLE_VERBS[category] || 'Support'
  const cleaned = cleanVagueLanguage(raw)
  const words = cleaned.split(/\s+/).filter(w => w.length > 2)

  // Extract key nouns/objects from the prompt
  const objectWords = words
    .filter(w => !['and', 'the', 'for', 'our', 'with', 'who', 'can', 'need', 'someone', 'want', 'help'].includes(w.toLowerCase()))
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

  if (objectWords.length < 2) return `${verb} ${category} Tasks`
  return `${verb} ${objectWords.join(' ')}`.slice(0, 60)
}

// ── Description generation (bullet-pointed, max 150 words) ──────────────────

function generateV3Description(raw: string): string {
  const cleaned = cleanVagueLanguage(raw)
  const sentences = cleaned
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 3)

  const bullets: string[] = []

  for (const sentence of sentences) {
    // Make each bullet concrete and actionable
    const capitalised = sentence.charAt(0).toUpperCase() + sentence.slice(1)
    const ended = capitalised.endsWith('.') ? capitalised : capitalised + '.'
    bullets.push(`• ${ended}`)
    if (bullets.length >= 5) break
  }

  // Add standard deliverable bullets if we have few
  if (bullets.length < 3) {
    bullets.push('• Deliver clear, documented outputs for each task.')
    bullets.push('• Collaborate with the team and provide regular progress updates.')
    bullets.push('• Manage your own schedule within the agreed timeframe.')
  }

  // Trim to 150 words max
  const full = bullets.join('\n')
  const words = full.split(/\s+/)
  if (words.length > 150) {
    return words.slice(0, 150).join(' ') + '...'
  }
  return full
}

// ── Public API ──────────────────────────────────────────────────────────────

export interface AIv3Result {
  title: string
  description: string
}

/** Deterministic fallback when Claude API is unavailable. */
function fallbackGenerate(raw: string): AIv3Result {
  const category = detectCategory(raw)
  const title = generateV3Title(raw, category)
  const description = generateV3Description(raw)
  return { title, description }
}

/**
 * Generates a gig title and description using Claude API.
 * Falls back to deterministic generation if the API is unavailable.
 */
export async function simulateAIv3(raw: string): Promise<AIv3Result> {
  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: raw }),
    })
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    return fallbackGenerate(raw)
  }
}

/**
 * Count business days (Mon–Fri) between two ISO date strings, inclusive.
 * Extracted from Step2Timeline for shared use.
 */
export function countBusinessDays(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  let count = 0
  const d = new Date(s)
  while (d <= e) {
    const day = d.getDay()
    if (day !== 0 && day !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}
