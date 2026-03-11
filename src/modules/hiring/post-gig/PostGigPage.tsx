import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import M3Stepper           from '@/components/ui/M3Stepper'
import AIEntryPage         from './AIEntryPage'
import Step1Details        from './Step1Details'
import Step2Timeline       from './Step2Timeline'
import Step3Budget         from './Step3Budget'
import Step4Preferences    from './Step4Preferences'
import Step5ReviewPublish  from './Step5ReviewPublish'
import Step6Confirmation   from './Step6Confirmation'
import { INITIAL_WIZARD_STATE, simulateAI } from './gigUtils'
import type { WizardState } from './gigUtils'
import { Progress } from '@sicaho-collab/m3-design-system'

// ─────────────────────────────────────────────────────────────────────────────
//  Step definitions for the 5-step stepper
// ─────────────────────────────────────────────────────────────────────────────

const STEP_DEFS = [
  { label: 'Details' },
  { label: 'Timeline' },
  { label: 'Budget' },
  { label: 'Preferences' },
  { label: 'Review & Publish' },
]

// ─────────────────────────────────────────────────────────────────────────────
//  PostGigPage — AI entry → 5-step wizard → confirmation
// ─────────────────────────────────────────────────────────────────────────────

// 'entry' = AI entry page
// 1-5     = wizard steps
// 6       = confirmation
type StepNum = 'entry' | 'loading' | 1 | 2 | 3 | 4 | 5 | 6

export default function PostGigPage() {
  const navigate = useNavigate()
  const [step,   setStep]   = useState<StepNum>('entry')
  const [wizard, setWizard] = useState<WizardState>(INITIAL_WIZARD_STATE)

  function patch(partial: Partial<WizardState>) {
    setWizard(prev => ({ ...prev, ...partial }))
  }

  // When user submits from the AI entry page
  async function handleAIEntry(description: string) {
    patch({ rawDescription: description })
    setStep('loading')

    // Simulate AI generation
    const ai = await simulateAI(description)
    patch({
      ...ai,
      rawDescription: description,
    })
    setStep(1)
  }

  // Show AI entry page (no header/stepper)
  if (step === 'entry') {
    return <AIEntryPage onSubmit={handleAIEntry} />
  }

  // Show loading state
  if (step === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Progress variant="circular" indeterminate className="size-10 text-m3-primary" />
        <p className="text-sm text-m3-on-surface-variant">Creating your gig with AI...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">

      {/* ── Header with close button ── */}
      {step !== 6 && (
        <div className="flex items-center gap-4 mb-6">
          <button
            className="text-m3-on-surface-variant text-xl bg-transparent border-none cursor-pointer p-1 hover:text-m3-on-surface"
            onClick={() => navigate('/hiring')}
          >
            ✕
          </button>
          <h1 className="text-xl font-bold text-m3-on-surface">Post a New Gig</h1>
        </div>
      )}

      {/* ── 5-step stepper — hidden on confirmation ── */}
      {typeof step === 'number' && step <= 5 && (
        <>
          <hr className="border-m3-outline-variant mb-6" />
          <M3Stepper steps={STEP_DEFS} current={step} className="mb-8" />
        </>
      )}

      {/* ── Step content (wrapped in light bg) ── */}
      {typeof step === 'number' && step <= 5 && (
        <div className="bg-m3-surface-container-lowest rounded-m3-md p-6">
          {step === 1 && (
            <Step1Details
              wizard={wizard}
              patch={patch}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Timeline
              wizard={wizard}
              patch={patch}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Budget
              wizard={wizard}
              patch={patch}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Step4Preferences
              wizard={wizard}
              patch={patch}
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
            />
          )}
          {step === 5 && (
            <Step5ReviewPublish
              wizard={wizard}
              patch={patch}
              onBack={() => setStep(4)}
              onPublish={() => setStep(6)}
            />
          )}
        </div>
      )}

      {step === 6 && (
        <Step6Confirmation
          wizard={wizard}
          onViewGig={() => navigate('/hiring')}
          onPostAnother={() => {
            setWizard(INITIAL_WIZARD_STATE)
            setStep('entry')
          }}
        />
      )}
    </div>
  )
}
