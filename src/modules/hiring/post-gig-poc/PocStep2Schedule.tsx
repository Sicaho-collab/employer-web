import { Card, CardContent } from "@/components/ui/card"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"
import type { PocGigData } from "./PocStep1Task"

interface Props {
  data: PocGigData
  patch: (updates: Partial<PocGigData>) => void
  onNext: () => void
  onBack: () => void
}

export default function PocStep2Schedule({ data, patch, onNext, onBack }: Props) {
  const today = new Date().toISOString().split("T")[0]
  const minEnd = data.startDate || today

  const startValid = data.startDate >= today
  const endValid = data.endDate >= minEnd
  const canContinue = data.startDate !== "" && data.endDate !== "" && startValid && endValid

  return (
    <div className="bg-m3-surface-container-lowest rounded-m3-md p-6">
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <CardContent className="flex flex-col gap-5 p-0">
          <p className="text-sm font-semibold text-m3-on-surface">Set the Schedule</p>

          <TextField
            type="date"
            variant="outlined"
            label="Start Date"
            value={data.startDate}
            onChange={(e) => {
              const newStart = e.target.value
              if (data.endDate && newStart > data.endDate) {
                patch({ startDate: newStart, endDate: "" })
              } else {
                patch({ startDate: newStart })
              }
            }}
            min={today}
            error={data.startDate !== "" && !startValid}
            errorText="Start date cannot be in the past"
          />

          <TextField
            type="date"
            variant="outlined"
            label="End Date"
            value={data.endDate}
            onChange={(e) => patch({ endDate: e.target.value })}
            min={minEnd}
            error={data.endDate !== "" && !endValid}
            errorText="End date must be on or after start date"
          />
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Button disabled={!canContinue} onClick={onNext}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
