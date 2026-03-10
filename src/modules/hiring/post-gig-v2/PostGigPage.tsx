import { useState, useCallback } from 'react'
import M3Stepper from '@/components/ui/M3Stepper'
import Step1Task, { INITIAL_GIG_DATA } from './Step1Task'
import Step2Schedule from './Step2Schedule'
import Step3Budget from './Step3Budget'
import Step4Review from './Step4Review'
import type { GigData } from './Step1Task'

const STEPS = [
  { label: 'Task' },
  { label: 'Schedule' },
  { label: 'Budget' },
  { label: 'Review' },
]

const TOTAL_STEPS = 4

export default function PostGigPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<GigData>(INITIAL_GIG_DATA)

  const patch = useCallback((updates: Partial<GigData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
  const goBack = () => setStep(s => Math.max(s - 1, 1))
  const goToStep = (n: number) => setStep(n)

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-m3-on-surface">Post a Gig</h1>
      <p className="text-sm text-m3-on-surface-variant mb-8">
        Create a new gig for students to apply
      </p>

      <M3Stepper steps={STEPS} current={step} className="mb-6" />

      {step === 1 && (
        <Step1Task data={data} patch={patch} onNext={goNext} />
      )}
      {step === 2 && (
        <Step2Schedule data={data} patch={patch} onBack={goBack} onNext={goNext} />
      )}
      {step === 3 && (
        <Step3Budget data={data} patch={patch} onBack={goBack} onNext={goNext} />
      )}
      {step === 4 && (
        <Step4Review data={data} onBack={goBack} onGoToStep={goToStep} />
      )}
    </div>
  )
}
