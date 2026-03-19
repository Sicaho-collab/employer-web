import { Card, CardContent, TextField, Button } from '@sicaho-collab/ui-web'
import type { PocGigData } from "./PocStep1Task"

interface Props {
  data: PocGigData
  patch: (updates: Partial<PocGigData>) => void
  onNext: () => void
  onBack: () => void
}

export default function PocStep3Budget({ data, patch, onNext, onBack }: Props) {
  const budgetNum = parseFloat(data.budget)
  const hoursNum = parseFloat(data.estimatedHours)
  const budgetValid = !isNaN(budgetNum) && budgetNum > 0
  const hoursValid = !isNaN(hoursNum) && hoursNum > 0
  const canContinue = budgetValid && hoursValid

  const estimatedRate = canContinue ? (budgetNum / hoursNum).toFixed(2) : null

  return (
    <div className="bg-m3-surface-container-lowest rounded-m3-md p-6">
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <CardContent className="flex flex-col gap-5 p-0">
          <p className="text-sm font-semibold text-m3-on-surface">Budget and Hours</p>

          <TextField
            type="number"
            variant="outlined"
            label="Budget ($)"
            placeholder="150"
            required
            value={data.budget}
            onChange={(e) => patch({ budget: e.target.value })}
            min={1}
            error={data.budget !== "" && !budgetValid}
            errorText="Enter a valid budget greater than $0"
          />

          <TextField
            type="number"
            variant="outlined"
            label="Estimated Hours"
            placeholder="5"
            required
            value={data.estimatedHours}
            onChange={(e) => patch({ estimatedHours: e.target.value })}
            min={1}
            error={data.estimatedHours !== "" && !hoursValid}
            errorText="Enter valid hours greater than 0"
          />

          <hr className="border-m3-outline-variant" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-m3-on-surface-variant">Estimated rate:</span>
            <span className="text-base font-semibold text-m3-primary">
              {estimatedRate ? `$${estimatedRate}/hr` : "—"}
            </span>
          </div>
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
