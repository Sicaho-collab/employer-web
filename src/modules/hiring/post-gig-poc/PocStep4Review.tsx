import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PocGigData } from "./PocStep1Task"

interface Props {
  data: PocGigData
  onBack: () => void
  onGoToStep: (step: number) => void
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—"
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function PocStep4Review({ data, onBack, onGoToStep }: Props) {
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const budgetNum = parseFloat(data.budget)
  const hoursNum = parseFloat(data.estimatedHours)
  const estimatedRate = hoursNum > 0 ? (budgetNum / hoursNum).toFixed(2) : "—"

  function handlePublish() {
    setPublishing(true)
    setTimeout(() => {
      setPublishing(false)
      setPublished(true)
    }, 1500)
  }

  if (published) {
    return (
      <div className="bg-m3-surface-container-lowest rounded-m3-md p-6">
        <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
          <CardContent className="flex flex-col items-center gap-4 p-0 py-8">
            <div className="w-16 h-16 rounded-full bg-m3-primary-container flex items-center justify-center">
              <svg className="w-8 h-8 text-m3-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-m3-on-surface">Your gig has been published.</p>
            <p className="text-sm text-m3-on-surface-variant text-center max-w-md">
              "{data.title}" is now live. Students can discover and apply for it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-m3-surface-container-lowest rounded-m3-md p-6">
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <CardContent className="flex flex-col gap-0 p-0">
          <p className="text-sm font-bold text-m3-on-surface mb-4">Review your gig</p>

          {/* Task Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Gig Title</span>
              <p className="text-base font-medium text-m3-on-surface">{data.title}</p>
              <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide mt-3">Task Description</span>
              <p className="text-sm text-m3-on-surface-variant whitespace-pre-wrap">{data.description}</p>
            </div>
            <Button variant="text" size="sm" onClick={() => onGoToStep(1)}>Edit</Button>
          </div>

          <hr className="border-m3-outline-variant my-4" />

          {/* Schedule Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Schedule</span>
              <p className="text-sm text-m3-on-surface">
                {formatDate(data.startDate)} — {formatDate(data.endDate)}
              </p>
            </div>
            <Button variant="text" size="sm" onClick={() => onGoToStep(2)}>Edit</Button>
          </div>

          <hr className="border-m3-outline-variant my-4" />

          {/* Budget Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xs text-m3-on-surface-variant uppercase tracking-wide">Budget</span>
              <p className="text-sm text-m3-on-surface">
                ${budgetNum.toFixed(2)} · {hoursNum} hours · ${estimatedRate}/hr
              </p>
            </div>
            <Button variant="text" size="sm" onClick={() => onGoToStep(3)}>Edit</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Button onClick={handlePublish} disabled={publishing}>
          {publishing ? "Publishing…" : "Publish Gig"}
        </Button>
      </div>
    </div>
  )
}
