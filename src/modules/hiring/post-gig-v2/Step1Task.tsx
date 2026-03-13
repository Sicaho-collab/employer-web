import { useState } from 'react'
import { Button, Card, TextField } from '@sicaho-collab/ui-web'

export interface GigData {
  title: string
  description: string
  startDate: string
  endDate: string
  budget: string
  estimatedHours: string
}

export const INITIAL_GIG_DATA: GigData = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  budget: '',
  estimatedHours: '',
}

interface Props {
  data: GigData
  patch: (updates: Partial<GigData>) => void
  onNext: () => void
}

export default function Step1Task({ data, patch, onNext }: Props) {
  const [titleTouched, setTitleTouched] = useState(false)
  const [descTouched, setDescTouched] = useState(false)

  const titleLen = data.title.length
  const descLen = data.description.length

  const titleError = titleTouched && titleLen > 0 && titleLen < 5
    ? 'Title must be at least 5 characters'
    : titleTouched && titleLen === 0
      ? 'Gig title is required'
      : undefined

  const descError = descTouched && descLen > 0 && descLen < 20
    ? 'Description must be at least 20 characters'
    : descTouched && descLen === 0
      ? 'Task description is required'
      : undefined

  const canContinue = titleLen >= 5 && titleLen <= 100 && descLen >= 20 && descLen <= 1000

  return (
    <>
      <Card variant="outlined" className="p-5 flex flex-col gap-4 bg-m3-surface-container-lowest">
        <div>
          <TextField
            variant="outlined"
            label="Gig Title"
            placeholder="Campus Event Setup Assistant"
            value={data.title}
            maxLength={100}
            onChange={e => patch({ title: e.target.value.slice(0, 100) })}
            onBlur={() => setTitleTouched(true)}
            error={!!titleError}
            errorText={titleError}
          />
          <p className={`text-xs mt-1 px-4 ${titleLen >= 100 ? 'text-m3-error' : 'text-m3-on-surface-variant'}`}>
            {titleLen} / 100
          </p>
        </div>

        <div>
          <TextField
            variant="outlined"
            label="Task Description"
            placeholder="Describe what the student will be doing..."
            multiline
            rows={4}
            value={data.description}
            maxLength={1000}
            onChange={e => patch({ description: e.target.value.slice(0, 1000) })}
            onBlur={() => setDescTouched(true)}
            error={!!descError}
            errorText={descError}
          />
          <p className={`text-xs mt-1 px-4 ${descLen >= 1000 ? 'text-m3-error' : 'text-m3-on-surface-variant'}`}>
            {descLen} / 1000
          </p>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button disabled={!canContinue} onClick={onNext}>
          Continue
        </Button>
      </div>
    </>
  )
}
