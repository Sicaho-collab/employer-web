import { useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { Button, Card } from '@sicaho-collab/m3-design-system'
import type { GigV3Data } from './PostGigV3Page'

interface Props {
  data: GigV3Data
  patch: (updates: Partial<GigV3Data>) => void
  onBack: () => void
  onNext: () => void
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function countBusinessDays(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  let count = 0
  const d = new Date(s)
  while (d <= e) {
    const day = d.getDay()
    if (day !== 0 && day !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

/** Convert yyyy-mm-dd to dd/mm/yyyy */
function toDisplay(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

interface DatePickerFieldProps {
  id: string
  label: string
  value: string
  min?: string
  error?: string
  onBlur: () => void
  onChange: (iso: string) => void
}

function DatePickerField({ id, label, value, min, error, onBlur, onChange }: DatePickerFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[var(--text-sm)] font-semibold text-m3-on-surface"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center w-full h-14 rounded-m3-xs border transition-colors focus-within:border-2 focus-within:border-m3-primary ${
          error
            ? 'border-m3-error focus-within:border-m3-error'
            : 'border-m3-outline'
        }`}
      >
        <input
          id={id}
          type="date"
          min={min}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          className="absolute inset-0 w-full h-full px-4 bg-transparent text-transparent cursor-pointer outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
        />
        <span className={`px-4 text-[var(--text-base)] pointer-events-none ${
          value ? 'text-m3-on-surface' : 'text-m3-on-surface-variant'
        }`}>
          {value ? toDisplay(value) : 'dd/mm/yyyy'}
        </span>
        <Calendar className="absolute right-4 h-5 w-5 text-m3-on-surface-variant pointer-events-none" />
      </div>
      {error && (
        <p className="text-[var(--text-xs)] text-m3-error" role="alert">{error}</p>
      )}
    </div>
  )
}

export default function Step2Timeline({ data, patch, onBack, onNext }: Props) {
  const [startTouched, setStartTouched] = useState(false)
  const [endTouched, setEndTouched] = useState(false)

  const today = todayISO()

  const startError =
    startTouched && !data.startDate ? 'Please select a start date' : undefined

  const endDateConflict =
    data.startDate && data.endDate && data.endDate <= data.startDate

  const endError = endDateConflict
    ? 'End date must be after start date'
    : endTouched && !data.endDate
      ? 'Please select an end date'
      : undefined

  const businessDays = useMemo(() => {
    if (data.startDate && data.endDate && data.endDate > data.startDate) {
      return countBusinessDays(data.startDate, data.endDate)
    }
    return null
  }, [data.startDate, data.endDate])

  const canContinue =
    !!data.startDate &&
    !!data.endDate &&
    data.endDate > data.startDate

  function handleStartChange(iso: string) {
    patch({ startDate: iso })
    if (data.endDate && data.endDate <= iso) {
      patch({ endDate: '' })
    }
  }

  function handleContinue() {
    setStartTouched(true)
    setEndTouched(true)
    if (canContinue) onNext()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[var(--text-xl)] font-bold text-m3-on-surface">
            Great! When do you need this done?
          </h2>
          <p className="text-[var(--text-sm)] text-m3-on-surface-variant mt-1">
            Pick your start and end dates. I'll count business days for you automatically.
          </p>
        </div>

        <Card
          variant="outlined"
          className="p-4 md:p-5 flex flex-col gap-5 bg-m3-surface-container-lowest"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DatePickerField
              id="start-date"
              label="Start Date"
              value={data.startDate}
              min={today}
              error={startError}
              onBlur={() => setStartTouched(true)}
              onChange={handleStartChange}
            />
            <DatePickerField
              id="end-date"
              label="End Date"
              value={data.endDate}
              min={data.startDate || today}
              error={endError}
              onBlur={() => setEndTouched(true)}
              onChange={iso => patch({ endDate: iso })}
            />
          </div>

          {businessDays !== null && (
            <div className="rounded-m3-sm bg-m3-primary-container/40 px-4 py-3">
              <span className="text-[var(--text-sm)] font-medium text-m3-primary">
                Gig duration: {businessDays} business day{businessDays !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button disabled={!canContinue} onClick={handleContinue} className="w-full sm:w-auto">
          Continue
        </Button>
      </div>
    </>
  )
}
