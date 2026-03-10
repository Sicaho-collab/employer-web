import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TextField } from '@/components/ui/text-field'
import type { GigData } from './Step1Task'

interface Props {
  data: GigData
  patch: (updates: Partial<GigData>) => void
  onBack: () => void
  onNext: () => void
}

export default function Step3Budget({ data, patch, onBack, onNext }: Props) {
  const [budgetTouched, setBudgetTouched] = useState(false)
  const [hoursTouched, setHoursTouched] = useState(false)

  const budgetNum = parseFloat(data.budget)
  const hoursNum = parseFloat(data.estimatedHours)

  const budgetValid = !isNaN(budgetNum) && budgetNum > 0
  const hoursValid = !isNaN(hoursNum) && hoursNum > 0 && Number.isInteger(hoursNum)

  const budgetError = budgetTouched && !data.budget
    ? 'Budget is required'
    : budgetTouched && data.budget && !budgetValid
      ? 'Budget must be greater than zero'
      : undefined

  const hoursError = hoursTouched && !data.estimatedHours
    ? 'Estimated hours is required'
    : hoursTouched && data.estimatedHours && (isNaN(hoursNum) || hoursNum <= 0)
      ? 'Estimated hours must be greater than zero'
      : hoursTouched && data.estimatedHours && !Number.isInteger(hoursNum)
        ? 'Please enter a whole number'
        : undefined

  const canContinue = budgetValid && hoursValid
  const showRate = budgetValid && hoursValid
  const rate = showRate ? (budgetNum / hoursNum).toFixed(2) : null

  return (
    <>
      <Card variant="outlined" className="p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
        <TextField
          variant="outlined"
          type="number"
          label="Budget ($)"
          placeholder="e.g., 150"
          value={data.budget}
          onChange={e => patch({ budget: e.target.value })}
          onBlur={() => setBudgetTouched(true)}
          error={!!budgetError}
          errorText={budgetError}
        />

        <TextField
          variant="outlined"
          type="number"
          label="Estimated Hours"
          placeholder="e.g., 5"
          value={data.estimatedHours}
          onChange={e => patch({ estimatedHours: e.target.value })}
          onBlur={() => setHoursTouched(true)}
          error={!!hoursError}
          errorText={hoursError}
        />

        {showRate && (
          <p className="text-sm font-medium text-m3-on-surface-variant">
            Estimated rate: ${rate}/hr
          </p>
        )}
      </Card>

      <div className="flex justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!canContinue} onClick={onNext}>
          Continue
        </Button>
      </div>
    </>
  )
}
