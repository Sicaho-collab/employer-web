import { useState, useCallback } from "react"
import M3Stepper from "@/components/ui/M3Stepper"
import PocStep1Task, { type PocGigData } from "./PocStep1Task"
import PocStep2Schedule from "./PocStep2Schedule"
import PocStep3Budget from "./PocStep3Budget"
import PocStep4Review from "./PocStep4Review"

const STEPS = [
  { label: "Task" },
  { label: "Schedule" },
  { label: "Budget" },
  { label: "Review" },
]

const INITIAL_DATA: PocGigData = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
  estimatedHours: "",
}

export default function PostGigPocPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<PocGigData>(INITIAL_DATA)

  const patch = useCallback((updates: Partial<PocGigData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))
  const goToStep = (step: number) => setCurrentStep(step)

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-m3-on-surface mb-1">Post a Gig</h1>
      <p className="text-sm text-m3-on-surface-variant mb-6">
        Create a new gig in 4 simple steps.
      </p>

      <hr className="border-m3-outline-variant mb-6" />

      <M3Stepper steps={STEPS} current={currentStep} className="mb-8" />

      {currentStep === 1 && (
        <PocStep1Task data={data} patch={patch} onNext={goNext} />
      )}
      {currentStep === 2 && (
        <PocStep2Schedule data={data} patch={patch} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 3 && (
        <PocStep3Budget data={data} patch={patch} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 4 && (
        <PocStep4Review data={data} onBack={goBack} onGoToStep={goToStep} />
      )}
    </div>
  )
}
