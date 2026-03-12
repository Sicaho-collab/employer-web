import { useState } from 'react'
import { Button, Card, Alert } from '@sicaho-collab/ui-web'
import { AnimatePresence } from 'framer-motion'
import type { GigData } from './Step1Task'

interface Props {
  data: GigData
  onBack: () => void
  onGoToStep: (step: number) => void
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return '$0.00'
  return `$${num.toFixed(2)}`
}

export default function Step4Review({ data, onBack, onGoToStep }: Props) {
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const budgetNum = parseFloat(data.budget)
  const hoursNum = parseFloat(data.estimatedHours)
  const rate = !isNaN(budgetNum) && !isNaN(hoursNum) && hoursNum > 0
    ? (budgetNum / hoursNum).toFixed(2)
    : '0.00'

  async function handlePublish() {
    setPublishing(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(() => {
          // Simulate success (swap resolve/reject for error testing)
          resolve(undefined)
        }, 1500)
      })
      // On success, redirect would happen here
      // navigate('/hiring', { state: { success: 'Your gig has been published.' } })
      setPublished(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <>
      <Card variant="outlined" className="p-5 flex flex-col gap-6 bg-m3-surface-container-lowest">
        {/* Task Details */}
        <section>
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-m3-on-surface">Task Details</p>
            <Button
              variant="text"
              size="sm"
              disabled={publishing}
              onClick={() => onGoToStep(1)}
            >
              Edit
            </Button>
          </div>
          <div className="border-b border-m3-outline-variant mb-3" />
          <div className="flex flex-col gap-2">
            <p className="text-xs text-m3-on-surface-variant">Gig Title</p>
            <p className="text-sm font-medium text-m3-on-surface">{data.title}</p>
            <p className="text-xs text-m3-on-surface-variant mt-1">Task Description</p>
            <p className="text-sm text-m3-on-surface">{data.description}</p>
          </div>
        </section>

        {/* Schedule */}
        <section>
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-m3-on-surface">Schedule</p>
            <Button
              variant="text"
              size="sm"
              disabled={publishing}
              onClick={() => onGoToStep(2)}
            >
              Edit
            </Button>
          </div>
          <div className="border-b border-m3-outline-variant mb-3" />
          <div className="flex flex-col gap-2">
            <p className="text-xs text-m3-on-surface-variant">Start Date</p>
            <p className="text-sm font-medium text-m3-on-surface">{formatDate(data.startDate)}</p>
            <p className="text-xs text-m3-on-surface-variant mt-1">End Date</p>
            <p className="text-sm font-medium text-m3-on-surface">{formatDate(data.endDate)}</p>
          </div>
        </section>

        {/* Budget */}
        <section>
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-m3-on-surface">Budget</p>
            <Button
              variant="text"
              size="sm"
              disabled={publishing}
              onClick={() => onGoToStep(3)}
            >
              Edit
            </Button>
          </div>
          <div className="border-b border-m3-outline-variant mb-3" />
          <div className="flex flex-col gap-2">
            <p className="text-xs text-m3-on-surface-variant">Budget</p>
            <p className="text-sm font-medium text-m3-on-surface">{formatCurrency(data.budget)}</p>
            <p className="text-xs text-m3-on-surface-variant mt-1">Estimated Hours</p>
            <p className="text-sm font-medium text-m3-on-surface">{hoursNum} hours</p>
            <p className="text-xs text-m3-on-surface-variant mt-1">Estimated Rate</p>
            <p className="text-sm font-medium text-m3-on-surface">${rate}/hr</p>
          </div>
        </section>
      </Card>

      {error && (
        <div className="bg-m3-error-container text-m3-on-error-container text-sm p-3 rounded-m3-sm mt-4">
          {error}
        </div>
      )}

      <AnimatePresence>
        {published && (
          <Alert
            variant="success"
            title="Gig published"
            description="Your gig has been published successfully."
            onClose={() => setPublished(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" disabled={publishing} onClick={onBack}>
          Back
        </Button>
        <Button disabled={publishing} onClick={handlePublish}>
          {publishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </>
  )
}
