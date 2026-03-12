import { useState, useMemo } from 'react'
import { Info } from 'lucide-react'
import { Button, Card } from '@sicaho-collab/m3-design-system'
import { TextField } from '@/components/ui/text-field'
import type { GigV3Data } from './PostGigV3Page'
import { calculateFeeBreakdown, formatCurrency, isValidBudgetInput, MAX_BUDGET } from './fee-utils'

interface Props {
  data: GigV3Data
  patch: (updates: Partial<GigV3Data>) => void
  onBack: () => void
  onNext: () => void
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="group/tip relative inline-flex ml-1 cursor-help">
      <Info className="h-4 w-4 text-m3-on-surface-variant" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block w-56 rounded-m3-xs bg-m3-inverse-surface text-m3-inverse-on-surface text-[var(--text-xs)] px-3 py-2 text-center z-20 shadow-m3-2">
        {text}
      </span>
    </span>
  )
}

export default function Step3Budget({ data, patch, onBack, onNext }: Props) {
  const [budgetTouched, setBudgetTouched] = useState(false)

  const budgetNum = parseFloat(data.budget)
  const hasValidFormat = data.budget !== '' && isValidBudgetInput(data.budget)
  const isPositive = hasValidFormat && !isNaN(budgetNum) && budgetNum > 0
  const isUnderMax = isPositive && budgetNum <= MAX_BUDGET
  const isValid = isPositive && isUnderMax

  const budgetError = (() => {
    if (!budgetTouched) return undefined
    if (data.budget === '' || !hasValidFormat || !isPositive) {
      return 'Please enter a valid budget greater than $0.00'
    }
    if (!isUnderMax) {
      return `Budget cannot exceed $${MAX_BUDGET.toLocaleString()}`
    }
    return undefined
  })()

  const breakdown = useMemo(() => {
    if (!isValid) return null
    return calculateFeeBreakdown(budgetNum)
  }, [budgetNum, isValid])

  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    // Allow empty (so user can clear) or valid partial numeric input
    if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) {
      patch({ budget: val })
    }
  }

  function handleContinue() {
    setBudgetTouched(true)
    if (isValid) onNext()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[var(--text-xl)] font-bold text-m3-on-surface">
            Perfect! What's your budget?
          </h2>
          <p className="text-[var(--text-sm)] text-m3-on-surface-variant mt-1">
            I'll show you the breakdown
          </p>
        </div>

        <Card
          variant="outlined"
          className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest overflow-visible"
        >
          <p className="text-[var(--text-sm)] font-semibold text-m3-on-surface">
            My Budget
          </p>
          <TextField
            variant="outlined"
            label="Student payment (incl. super)"
            placeholder="e.g., 500.00"
            value={data.budget}
            onChange={handleBudgetChange}
            onBlur={() => setBudgetTouched(true)}
            error={!!budgetError}
            errorText={budgetError}
            leadingIcon={<span className="text-m3-on-surface-variant font-medium">$</span>}
          />
        </Card>

        {/* Breakdown Card */}
        {breakdown && (
          <Card
            variant="outlined"
            className="p-4 md:p-5 flex flex-col gap-3 bg-m3-surface-container-lowest overflow-visible"
          >
            <p className="text-[var(--text-sm)] font-semibold text-m3-on-surface">
              Cost Breakdown
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-m3-on-surface-variant">Student payment (incl. super)</span>
                <span className="text-m3-on-surface font-medium">{formatCurrency(breakdown.studentPayment)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-m3-on-surface-variant">Alumable Service Fee (12%)</span>
                <span className="text-m3-on-surface font-medium">{formatCurrency(breakdown.serviceFee)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-m3-on-surface-variant">Processing fee (1.7%)</span>
                <span className="text-m3-on-surface font-medium">{formatCurrency(breakdown.processingFee)}</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-sm)]">
                <span className="flex items-center text-m3-on-surface-variant">
                  GST (10%)
                  <Tooltip text="GST is charged on the combined Alumable Service Fee and Processing fee" />
                </span>
                <span className="text-m3-on-surface font-medium">{formatCurrency(breakdown.gst)}</span>
              </div>

              <hr className="border-m3-outline-variant my-1" />

              <div className="flex justify-between text-[var(--text-base)]">
                <span className="font-semibold text-m3-on-surface">Total Gig Cost</span>
                <span className="font-bold text-m3-on-surface">{formatCurrency(breakdown.total)}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button disabled={!isValid} onClick={handleContinue} className="w-full sm:w-auto">
          Continue
        </Button>
      </div>
    </>
  )
}
