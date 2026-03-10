import { useState } from 'react'
import { calcBudget, fmt, generateGigId, FLOOR_HOURLY_RATE } from './gigUtils'
import type { WizardState } from './gigUtils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TextField } from '@/components/ui/text-field'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  wizard:   WizardState
  patch:    (partial: Partial<WizardState>) => void
  onBack:   () => void
  onPublish: () => void
}

export default function Step5ReviewPublish({ wizard, patch, onBack, onPublish }: Props) {
  const [posting, setPosting] = useState(false)
  const breakdown = calcBudget(wizard.budget)

  // Validation
  const nameOk  = wizard.approverName.trim().length > 0
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wizard.approverEmail.trim())
  const checksOk = wizard.isInternalApproved && wizard.isComplianceConfirmed && wizard.isTermsAgreed
  const canPost  = nameOk && emailOk && checksOk && !posting

  async function handlePublish() {
    if (!canPost) return
    setPosting(true)
    await new Promise(r => setTimeout(r, 900))
    const gigId = generateGigId()
    patch({ gigId })
    setPosting(false)
    onPublish()
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Gig Summary ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
        <p className="text-sm font-bold text-m3-on-surface">Gig Summary</p>

        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-m3-on-surface">{wizard.aiTitle || 'Untitled Gig'}</p>
          <p className="text-sm text-m3-on-surface-variant line-clamp-3">{wizard.aiDescription}</p>
        </div>

        <hr className="border-m3-outline-variant" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Category</span>
            <p className="font-medium text-m3-on-surface">{wizard.workCategory || 'General'}</p>
          </div>
          <div>
            <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Work Mode</span>
            <p className="font-medium text-m3-on-surface">{wizard.workMode || 'Remote'}</p>
          </div>
          <div>
            <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Timeline</span>
            <p className="font-medium text-m3-on-surface">
              {wizard.startDate && wizard.endDate
                ? `${wizard.startDate} → ${wizard.endDate}`
                : 'Not set'}
            </p>
          </div>
          <div>
            <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Budget</span>
            <p className="font-medium text-m3-on-surface">
              {wizard.budget ? fmt(parseFloat(wizard.budget)) + ' AUD' : 'Not set'}
            </p>
          </div>
        </div>

        {wizard.skills.length > 0 && (
          <>
            <hr className="border-m3-outline-variant" />
            <div>
              <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {wizard.skills.map((sk, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-m3-full border border-m3-outline-variant text-m3-on-surface">
                    {sk.skill}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {breakdown && (
          <>
            <hr className="border-m3-outline-variant" />
            <div className="bg-m3-primary-container rounded-m3-sm p-3 flex flex-col gap-1.5">
              <p className="text-sm text-m3-on-primary-container">
                Student earns <strong>{fmt(breakdown.studentPay)}</strong> · up to <strong>{breakdown.maxHours} hrs</strong>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-m3-primary bg-white border border-m3-primary/30 rounded-m3-full px-2 py-0.5">
                  {fmt(FLOOR_HOURLY_RATE)} / hr
                </span>
                <span className="text-xs text-m3-on-surface-variant">minimum legal rate</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* ── Internal Approver ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Internal Approver</p>
        <p className="text-sm text-m3-on-surface-variant">
          Who is authorising this gig on behalf of your organisation?
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <TextField
              variant="outlined"
              label="Approver Name"
              value={wizard.approverName}
              onChange={e => patch({ approverName: e.target.value })}
              error={!!wizard.approverName && !nameOk}
              errorText="Approver name is required."
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <TextField
              variant="outlined"
              label="Approver Email"
              type="email"
              value={wizard.approverEmail}
              onChange={e => patch({ approverEmail: e.target.value })}
              error={!!wizard.approverEmail && !emailOk}
              errorText="Please enter a valid email address."
            />
          </div>
        </div>
      </Card>

      {/* ── Confirmations ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Confirmations</p>

        <div className="flex items-start gap-3">
          <Checkbox
            id="check1"
            checked={wizard.isInternalApproved}
            onCheckedChange={v => patch({ isInternalApproved: !!v })}
            className="mt-0.5"
          />
          <label htmlFor="check1" className="text-sm text-m3-on-surface leading-relaxed cursor-pointer">
            I confirm this gig has received internal approval and the budget has been allocated.
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="check2"
            checked={wizard.isComplianceConfirmed}
            onCheckedChange={v => patch({ isComplianceConfirmed: !!v })}
            className="mt-0.5"
          />
          <label htmlFor="check2" className="text-sm text-m3-on-surface leading-relaxed cursor-pointer">
            I confirm the work described is appropriate for a student and meets workplace requirements.
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="check3"
            checked={wizard.isTermsAgreed}
            onCheckedChange={v => patch({ isTermsAgreed: !!v })}
            className="mt-0.5"
          />
          <label htmlFor="check3" className="text-sm text-m3-on-surface leading-relaxed cursor-pointer">
            I agree to Alumable's{' '}
            <a href="#" className="text-m3-primary underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-m3-primary underline">Engagement Policy</a>.
          </label>
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-m3-outline-variant">
        <Button variant="outlined" onClick={onBack} disabled={posting}>← Back</Button>
        <div className="flex gap-3">
          <Button onClick={handlePublish} disabled={!canPost}>
            {posting ? 'Publishing…' : 'Publish Gig →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
