import { Card, CardContent } from "@/components/ui/card"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"

export interface PocGigData {
  title: string
  description: string
  startDate: string
  endDate: string
  budget: string
  estimatedHours: string
}

interface Props {
  data: PocGigData
  patch: (updates: Partial<PocGigData>) => void
  onNext: () => void
}

export default function PocStep1Task({ data, patch, onNext }: Props) {
  const titleValid = data.title.trim().length >= 5
  const descValid = data.description.trim().length >= 20
  const canContinue = titleValid && descValid

  return (
    <div className="bg-m3-surface-container-lowest rounded-m3-md p-6">
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <CardContent className="flex flex-col gap-5 p-0">
          <p className="text-sm font-semibold text-m3-on-surface">Define the Task</p>

          <TextField
            variant="outlined"
            label="Gig Title"
            value={data.title}
            onChange={(e) => patch({ title: e.target.value })}
            maxLength={100}
            supportingText={`${data.title.length}/100 characters (min 5)`}
            error={data.title.length > 0 && !titleValid}
            errorText="Title must be at least 5 characters"
          />

          <TextField
            variant="outlined"
            label="Task Description"
            multiline
            rows={5}
            value={data.description}
            onChange={(e) => patch({ description: e.target.value })}
            maxLength={1000}
            supportingText={`${data.description.length}/1000 characters (min 20)`}
            error={data.description.length > 0 && !descValid}
            errorText="Description must be at least 20 characters"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button disabled={!canContinue} onClick={onNext}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
