import { fmt } from './gigUtils'
import type { WizardState } from './gigUtils'
import { Button, Card } from '@sicaho-collab/ui-web'

interface Props {
  wizard:         WizardState
  onViewGig:      () => void
  onPostAnother:  () => void
}

export default function Step6Confirmation({ wizard, onViewGig, onPostAnother }: Props) {
  const budgetNum = parseFloat(wizard.budget)

  return (
    <div className="max-w-[520px] mx-auto flex flex-col items-center gap-6 text-center">

      {/* ── Success icon ── */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 16L14 22L24 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Headline ── */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-m3-on-surface">Your gig is now live.</h2>
        <p className="text-sm text-m3-on-surface-variant">
          We're reviewing it and finding the right match for you.
        </p>
      </div>

      {/* ── Gig summary card ── */}
      <Card variant="outlined" className="w-full p-5 text-left flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-m3-on-surface flex-1">{wizard.aiTitle}</h3>
          <span className="text-xs text-m3-on-surface-variant font-mono bg-m3-surface-container rounded px-1.5 py-0.5 flex-shrink-0">
            {wizard.gigId}
          </span>
        </div>

        {wizard.startDate && wizard.endDate && (
          <div className="flex justify-between text-sm">
            <span className="text-m3-on-surface-variant">Timeline</span>
            <span className="text-m3-on-surface font-medium">{wizard.startDate} → {wizard.endDate}</span>
          </div>
        )}
        {!isNaN(budgetNum) && budgetNum > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-m3-on-surface-variant">Budget</span>
            <span className="text-m3-on-surface font-medium">{fmt(budgetNum)} AUD</span>
          </div>
        )}
        {wizard.approverName && (
          <div className="flex justify-between text-sm">
            <span className="text-m3-on-surface-variant">Approved by</span>
            <span className="text-m3-on-surface font-medium">{wizard.approverName}</span>
          </div>
        )}
      </Card>

      {/* ── What happens next ── */}
      <div className="w-full text-left flex flex-col gap-4">
        <p className="text-sm font-semibold text-m3-on-surface">What happens next</p>
        <ol className="flex flex-col gap-3">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-m3-primary-container text-m3-on-primary-container text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <span className="text-sm text-m3-on-surface">Alumable reviews and activates your gig on the student platform.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-m3-primary-container text-m3-on-primary-container text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <span className="text-sm text-m3-on-surface">You'll be notified when a student is matched to your gig.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-m3-primary-container text-m3-on-primary-container text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <span className="text-sm text-m3-on-surface">Review their profile and send an offer when you're ready.</span>
          </li>
        </ol>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="outlined" onClick={onPostAnother}>Post Another Gig</Button>
        <Button onClick={onViewGig}>View Gig →</Button>
      </div>
    </div>
  )
}
