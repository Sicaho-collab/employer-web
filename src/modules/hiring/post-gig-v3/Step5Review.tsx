import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { GigV3Data } from './PostGigV3Page'

interface Props {
  data: GigV3Data
  onBack: () => void
  onGoToStep: (step: number) => void
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function formatCurrency(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return '$0.00'
  return `$${num.toFixed(2)}`
}

const LOCATION_LABELS: Record<string, string> = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
}

export default function Step5Review({ data, onBack, onGoToStep }: Props) {
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handlePublish() {
    setPublishing(true)
    setError(null)
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Simulate success
          resolve()
        }, 1500)
      })
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  if (success) {
    return (
      <Card
        variant="outlined"
        className="p-4 md:p-8 flex flex-col items-center gap-4 bg-m3-surface-container-lowest text-center"
      >
        <div className="w-16 h-16 rounded-full bg-m3-primary text-m3-on-primary flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-m3-on-surface">
          Your gig has been published!
        </h2>
        <p className="text-sm text-m3-on-surface-variant">
          Students can now discover and apply for your gig on Alumable.
        </p>
        <Button onClick={() => (window.location.href = '/hiring')}>
          Go to Gig Management
        </Button>
      </Card>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Details Summary */}
        <SummaryCard
          title="Details"
          onEdit={() => onGoToStep(1)}
          disabled={publishing}
        >
          <FieldRow label="Gig Title" value={data.title} />
          <FieldRow label="Description" value={data.description} />
          <FieldRow
            label="Capabilities"
            value={data.capabilities.length > 0 ? data.capabilities.join(', ') : 'None selected'}
          />
        </SummaryCard>

        {/* Timeline Summary */}
        <SummaryCard
          title="Timeline"
          onEdit={() => onGoToStep(2)}
          disabled={publishing}
        >
          <FieldRow label="Start Date" value={formatDate(data.startDate)} />
          <FieldRow label="End Date" value={formatDate(data.endDate)} />
        </SummaryCard>

        {/* Budget Summary */}
        <SummaryCard
          title="Budget"
          onEdit={() => onGoToStep(3)}
          disabled={publishing}
        >
          <FieldRow label="Total Budget" value={formatCurrency(data.budget)} />
        </SummaryCard>

        {/* Preferences Summary */}
        <SummaryCard
          title="Preferences"
          onEdit={() => onGoToStep(4)}
          disabled={publishing}
        >
          <FieldRow
            label="Gig Type"
            value={
              data.locationType
                ? data.locationDetails
                  ? `${LOCATION_LABELS[data.locationType]} — ${data.locationDetails}`
                  : LOCATION_LABELS[data.locationType]
                : ''
            }
          />
          <FieldRow
            label="Application Deadline"
            value={formatDate(data.applicationDeadline)}
          />
          <FieldRow
            label="Approval"
            value={
              data.isOwner
                ? 'I am the owner'
                : data.approvalName
                  ? `${data.approvalName} (${data.approvalEmail})`
                  : ''
            }
          />
          {data.approvalNotes && (
            <FieldRow label="Approval Notes" value={data.approvalNotes} />
          )}
          {data.additionalNotes && (
            <FieldRow label="Additional Notes" value={data.additionalNotes} />
          )}
        </SummaryCard>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-m3-error-container text-m3-on-error-container text-sm p-3 rounded-m3-sm mt-4"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button variant="outlined" disabled={publishing} onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button disabled={publishing} onClick={handlePublish} className="w-full sm:w-auto">
          {publishing ? 'Publishing...' : 'Publish Gig'}
        </Button>
      </div>
    </>
  )
}

/* ── Shared sub-components ── */

function SummaryCard({
  title,
  onEdit,
  disabled,
  children,
}: {
  title: string
  onEdit: () => void
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <Card
      variant="outlined"
      className="p-4 md:p-5 bg-m3-surface-container-lowest"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-m3-on-surface">{title}</p>
        <Button
          variant="text"
          size="sm"
          disabled={disabled}
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
      <hr className="border-m3-outline-variant my-3" />
      <div className="flex flex-col gap-2">{children}</div>
    </Card>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-m3-on-surface-variant">{label}</p>
      <p className="text-sm text-m3-on-surface">{value}</p>
    </div>
  )
}
