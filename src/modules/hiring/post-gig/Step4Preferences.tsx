import type { WizardState } from './gigUtils'
import { Button, Card, TextField } from '@sicaho-collab/m3-design-system'

interface Props {
  wizard: WizardState
  patch:  (partial: Partial<WizardState>) => void
  onBack: () => void
  onNext: () => void
}

export default function Step4Preferences({ wizard, patch, onBack, onNext }: Props) {

  return (
    <div className="flex flex-col gap-5">

      {/* ── Work category ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Work Category</p>
        <p className="text-sm text-m3-on-surface-variant leading-relaxed">
          The category helps us match students with the right background.
        </p>
        <div className="flex flex-wrap gap-2">
          {['General', 'Engineering', 'Design', 'Marketing', 'Data & Analytics', 'Finance', 'Writing', 'Operations'].map(cat => (
            <button
              key={cat}
              className={
                wizard.workCategory === cat
                  ? 'px-4 py-2 text-sm font-medium rounded-m3-full bg-m3-primary text-white border-none cursor-pointer'
                  : 'px-4 py-2 text-sm font-medium rounded-m3-full bg-transparent text-m3-on-surface border border-m3-outline-variant cursor-pointer hover:bg-m3-surface-container'
              }
              onClick={() => patch({ workCategory: cat })}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Work mode ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Work Arrangement</p>
        <p className="text-sm text-m3-on-surface-variant leading-relaxed">
          How will the student work with your team?
        </p>
        <div className="flex flex-wrap gap-2">
          {['Remote', 'On-site', 'Hybrid'].map(mode => (
            <button
              key={mode}
              className={
                wizard.workMode === mode
                  ? 'px-4 py-2 text-sm font-medium rounded-m3-full bg-m3-primary text-white border-none cursor-pointer'
                  : 'px-4 py-2 text-sm font-medium rounded-m3-full bg-transparent text-m3-on-surface border border-m3-outline-variant cursor-pointer hover:bg-m3-surface-container'
              }
              onClick={() => patch({ workMode: mode })}
            >
              {mode}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Additional notes ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Additional Notes</p>
        <p className="text-sm text-m3-on-surface-variant leading-relaxed">
          Any extra information or requirements for the student? (optional)
        </p>
        <TextField
          variant="outlined"
          label="Notes (optional)"
          multiline
          rows={3}
          value={wizard.additionalNotes}
          maxLength={500}
          onChange={e => patch({ additionalNotes: e.target.value })}
        />
      </Card>

      {/* ── Footer ── */}
      <div className="flex justify-between gap-3 pt-4 border-t border-m3-outline-variant">
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Button onClick={onNext}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
