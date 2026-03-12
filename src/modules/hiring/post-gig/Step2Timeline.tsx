import type { WizardState } from './gigUtils'
import { Button, Card, TextField } from '@sicaho-collab/ui-web'

interface Props {
  wizard: WizardState
  patch:  (partial: Partial<WizardState>) => void
  onBack: () => void
  onNext: () => void
}

export default function Step2Timeline({ wizard, patch, onBack, onNext }: Props) {
  const minStart = new Date(Date.now() + 3 * 86_400_000).toISOString().split('T')[0]
  const today    = new Date().toISOString().split('T')[0]

  const startOk = !!wizard.startDate && wizard.startDate >= minStart
  const endOk   = !!wizard.endDate   && wizard.endDate   > wizard.startDate
  const canNext = startOk && endOk

  return (
    <div className="flex flex-col gap-5">

      {/* ── Date range ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">When should this work take place?</p>
        <p className="text-sm text-m3-on-surface-variant leading-relaxed">
          Choose a start and end date. Students need at least 3 days notice.
        </p>
        <div className="flex gap-3 items-start">
          <div className="flex-1 min-w-0">
            <TextField
              variant="outlined"
              label="Start date"
              type="date"
              value={wizard.startDate}
              min={minStart}
              onChange={e => patch({ startDate: e.target.value })}
              error={!!wizard.startDate && !startOk}
              errorText="Must be at least 3 days from today."
            />
          </div>
          <span className="text-m3-on-surface-variant mt-4 flex-shrink-0">→</span>
          <div className="flex-1 min-w-0">
            <TextField
              variant="outlined"
              label="End date"
              type="date"
              value={wizard.endDate}
              min={wizard.startDate || today}
              onChange={e => patch({ endDate: e.target.value })}
              error={!!wizard.endDate && !endOk}
              errorText="Must be after the start date."
            />
          </div>
        </div>
      </Card>

      {/* ── Application Deadline ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Application Deadline</p>
        <p className="text-sm text-m3-on-surface-variant leading-relaxed">
          Last day for students to apply for this gig.
        </p>
        <TextField
          variant="outlined"
          label="Application Deadline"
          type="date"
          value={wizard.applicationDeadline}
          min={today}
          max={wizard.startDate || undefined}
          onChange={e => patch({ applicationDeadline: e.target.value })}
        />
      </Card>

      {/* ── Footer ── */}
      <div className="flex justify-between gap-3 pt-4 border-t border-m3-outline-variant">
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Button disabled={!canNext} onClick={onNext}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
