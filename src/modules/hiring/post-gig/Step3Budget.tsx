import { useMemo } from 'react'
import { calcBudget, calcMinBudget, fmt, FLOOR_HOURLY_RATE } from './gigUtils'
import type { WizardState } from './gigUtils'
import { Button, Card } from '@sicaho-collab/ui-web'

interface Props {
  wizard: WizardState
  patch:  (partial: Partial<WizardState>) => void
  onBack: () => void
  onNext: () => void
}

export default function Step3Budget({ wizard, patch, onBack, onNext }: Props) {
  const MIN_BUDGET = calcMinBudget()
  const breakdown  = useMemo(() => calcBudget(wizard.budget), [wizard.budget])
  const budgetOk   = !!breakdown && parseFloat(wizard.budget) >= MIN_BUDGET
  const canNext    = budgetOk

  return (
    <div className="flex flex-col gap-5">

      {/* ── Budget input ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">What is your total budget?</p>
        <p className="text-sm text-m3-on-surface-variant leading-relaxed">
          Enter the full amount you want to spend. Your student's pay, platform fee,
          and GST are all included — nothing extra at invoice time.
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-m3-on-surface-variant flex-shrink-0">$</span>
          <input
            type="number"
            className="h-14 flex-1 max-w-[160px] bg-transparent outline-none text-m3-on-surface text-base px-3 border border-m3-outline rounded-m3-xs focus:border-2 focus:border-m3-primary"
            value={wizard.budget}
            min={MIN_BUDGET}
            step={10}
            placeholder="e.g. 1000"
            onChange={e => patch({ budget: e.target.value })}
          />
          <span className="text-sm text-m3-on-surface-variant flex-shrink-0">AUD</span>
        </div>

        {wizard.budget && !budgetOk && (
          <p className="text-xs text-m3-error px-1">
            Minimum budget is {fmt(MIN_BUDGET)} — enough for at least one hour at the {fmt(FLOOR_HOURLY_RATE)}/hr legal minimum rate.
          </p>
        )}

        {/* Live breakdown */}
        {breakdown && budgetOk && (
          <Card variant="filled" className="p-4 flex flex-col gap-3">

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-m3-on-surface">Total budget</span>
              <span className="text-sm font-bold text-m3-on-surface">{fmt(breakdown.total)}</span>
            </div>

            <hr className="border-m3-outline-variant" />

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-m3-on-surface-variant">Goes to your student</span>
              <span className="font-semibold text-m3-on-surface">{fmt(breakdown.studentPay)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pl-2">
              <span className="text-m3-on-surface-variant">Platform fee (12%)</span>
              <span className="text-m3-on-surface-variant">{fmt(breakdown.platformFee)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pl-2">
              <span className="text-m3-on-surface-variant">GST on platform fee (10%)</span>
              <span className="text-m3-on-surface-variant">{fmt(breakdown.gst)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pl-2">
              <span className="text-m3-on-surface-variant">Processing fee (1.5%)</span>
              <span className="text-m3-on-surface-variant">{fmt(breakdown.processingFee)}</span>
            </div>

            <hr className="border-m3-outline-variant" />

            <div className="bg-m3-primary-container rounded-m3-sm p-3 flex flex-col gap-1.5">
              <p className="text-sm text-m3-on-primary-container">
                Your student can work up to <strong>{breakdown.maxHours} hours</strong>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-m3-primary bg-white border border-m3-primary/30 rounded-m3-full px-2 py-0.5">
                  {fmt(FLOOR_HOURLY_RATE)} / hr
                </span>
                <span className="text-xs text-m3-on-surface-variant">minimum legal rate</span>
              </div>
            </div>

            <p className="text-xs text-m3-on-surface-variant leading-relaxed">
              Students are paid at or above the legal minimum. Actual hours are agreed
              directly and won't exceed this maximum.
            </p>
          </Card>
        )}
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
