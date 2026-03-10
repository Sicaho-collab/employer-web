import { useState, useMemo } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TextField } from '@/components/ui/text-field'
import type { GigV3Data } from './PostGigV3Page'

interface Props {
  data: GigV3Data
  patch: (updates: Partial<GigV3Data>) => void
  onBack: () => void
  onNext: () => void
}

const PLATFORM_FEE_RATE = 0.12
const PROCESSING_FEE_RATE = 0.017
const GST_RATE = 0.10
const MINIMUM_WAGE = 24.10 // AUS minimum wage per hour

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

function fmt(n: number): string {
  return n.toFixed(2)
}

export default function Step3Budget({ data, patch, onBack, onNext }: Props) {
  const [budgetTouched, setBudgetTouched] = useState(false)

  const totalBudget = parseFloat(data.budget)
  const isValid = !isNaN(totalBudget) && totalBudget > 0

  const budgetError =
    budgetTouched && (data.budget === '' || !isValid)
      ? 'Please enter a budget greater than $0'
      : undefined

  const breakdown = useMemo(() => {
    if (!isValid) return null

    const platformFee = totalBudget * PLATFORM_FEE_RATE
    const processingFee = totalBudget * PROCESSING_FEE_RATE
    const gst = (platformFee + processingFee) * GST_RATE
    const studentPayment = totalBudget - platformFee - processingFee - gst
    const maxHours = Math.floor((totalBudget / 1.12) / MINIMUM_WAGE)

    return {
      studentPayment,
      platformFee,
      processingFee,
      gst,
      total: totalBudget,
      maxHours,
    }
  }, [totalBudget, isValid])

  function handleContinue() {
    setBudgetTouched(true)
    if (isValid) onNext()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[var(--text-xl)] font-bold text-m3-on-surface">
            Perfect! What's your total budget?
          </h2>
          <p className="text-[var(--text-sm)] text-m3-on-surface-variant mt-1">
            I'll show you the breakdown
          </p>
        </div>

        <Card
          variant="outlined"
          className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest overflow-visible"
        >
          <div className="flex items-center">
            <p className="text-[var(--text-sm)] font-semibold text-m3-on-surface">
              Total Budget
            </p>
            <Tooltip text="Fees included are platform, processing fee, and GST" />
          </div>
          <TextField
            variant="outlined"
            type="number"
            label="Enter total budget ($)"
            placeholder="e.g., 500"
            value={data.budget}
            onChange={e => patch({ budget: e.target.value })}
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
              Budget Breakdown
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-m3-on-surface-variant">Student payment</span>
                <span className="text-m3-on-surface font-medium">${fmt(breakdown.studentPayment)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-m3-on-surface-variant">Platform fee (12%)</span>
                <span className="text-m3-on-surface font-medium">${fmt(breakdown.platformFee)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-sm)]">
                <span className="text-m3-on-surface-variant">Processing fee (1.7%)</span>
                <span className="text-m3-on-surface font-medium">${fmt(breakdown.processingFee)}</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-sm)]">
                <span className="flex items-center text-m3-on-surface-variant">
                  GST (10%)
                  <Tooltip text="GST is charged on both platform and processing fee" />
                </span>
                <span className="text-m3-on-surface font-medium">${fmt(breakdown.gst)}</span>
              </div>

              <hr className="border-m3-outline-variant my-1" />

              <div className="flex justify-between text-[var(--text-base)]">
                <span className="font-semibold text-m3-on-surface">Total</span>
                <span className="font-bold text-m3-on-surface">${fmt(breakdown.total)}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Hours Summary */}
        {breakdown && (
          <>
            <div className="rounded-m3-md bg-m3-primary-container px-5 py-4 text-center">
              <p className="text-[var(--text-lg)] font-bold text-m3-on-primary-container">
                Your student can work up to{' '}
                <span className="text-m3-primary">{breakdown.maxHours} hours</span>
              </p>
            </div>
            <p className="text-[var(--text-xs)] text-m3-on-surface-variant px-1">
              The number of hours your student can work is calculated based on your total budget and the current minimum wage (see{' '}
              <a
                href="https://www.fairwork.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-m3-primary hover:underline"
              >
                fairwork.gov.au
              </a>
              ).
            </p>
          </>
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
