import { useState } from 'react'
import { Button, Card, TextField } from '@sicaho-collab/m3-design-system'
import type { GigData } from './Step1Task'

interface Props {
  data: GigData
  patch: (updates: Partial<GigData>) => void
  onBack: () => void
  onNext: () => void
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export default function Step2Schedule({ data, patch, onBack, onNext }: Props) {
  const [startTouched, setStartTouched] = useState(false)
  const [endTouched, setEndTouched] = useState(false)
  const [endCleared, setEndCleared] = useState(false)

  const today = todayISO()

  const startError = startTouched && !data.startDate
    ? 'Start date is required'
    : startTouched && data.startDate && data.startDate < today
      ? 'Start date cannot be in the past'
      : undefined

  const endError = endTouched && !data.endDate
    ? 'End date is required'
    : endTouched && data.endDate && data.startDate && data.endDate < data.startDate
      ? 'End date must be on or after the start date'
      : undefined

  const startValid = !!data.startDate && data.startDate >= today
  const endValid = !!data.endDate && !!data.startDate && data.endDate >= data.startDate
  const canContinue = startValid && endValid

  function handleStartChange(value: string) {
    patch({ startDate: value })
    setStartTouched(true)
    if (data.endDate && value && data.endDate < value) {
      patch({ startDate: value, endDate: '' })
      setEndCleared(true)
    } else {
      setEndCleared(false)
    }
  }

  function handleEndChange(value: string) {
    patch({ endDate: value })
    setEndTouched(true)
    setEndCleared(false)
  }

  return (
    <>
      <Card variant="outlined" className="p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
        <TextField
          variant="outlined"
          type="date"
          label="Start Date"
          value={data.startDate}
          min={today}
          onChange={e => handleStartChange(e.target.value)}
          onBlur={() => setStartTouched(true)}
          error={!!startError}
          errorText={startError}
        />

        <div>
          <TextField
            variant="outlined"
            type="date"
            label="End Date"
            value={data.endDate}
            min={data.startDate || today}
            onChange={e => handleEndChange(e.target.value)}
            onBlur={() => setEndTouched(true)}
            error={!!endError}
            errorText={endError}
          />
          {endCleared && (
            <p className="text-xs mt-1 px-4 text-m3-on-surface-variant">
              End date was cleared because it was before the new start date.
            </p>
          )}
        </div>
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
