// Count per GigStage — gives employer an at-a-glance pipeline view.
import { GigStage } from '@/types/gig'
import { useNavigate } from 'react-router-dom'

interface StageCount {
  stage: GigStage
  label: string
  count: number
  color: string
}

// Placeholder counts — replace with aggregated query
const STAGE_COUNTS: StageCount[] = [
  { stage: GigStage.POSTED,  label: 'Posted',  count: 4, color: 'var(--stage-posted)'  },
  { stage: GigStage.MATCHED, label: 'Matched', count: 2, color: 'var(--stage-matched)' },
  { stage: GigStage.ACTIVE,  label: 'Active',  count: 5, color: 'var(--stage-active)'  },
  { stage: GigStage.DONE,    label: 'Done',    count: 3, color: 'var(--stage-done)'    },
  { stage: GigStage.CLOSED,  label: 'Closed',  count: 8, color: 'var(--stage-closed)'  },
]

export default function HiringSnapshot() {
  const navigate = useNavigate()

  return (
    <section className="bg-m3-surface border border-m3-outline-variant rounded-m3-md p-5 shadow-m3-1">
      <h2 className="text-[var(--text-base)] font-bold text-m3-on-surface mb-4">
        Hiring Pipeline
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {STAGE_COUNTS.map(({ stage, label, count, color }) => (
          <button
            key={stage}
            className="flex flex-col items-center gap-2 py-4 px-3 bg-m3-surface-container-low border border-m3-outline-variant rounded-m3-md cursor-pointer transition-all duration-150 hover:border-m3-primary hover:shadow-m3-1"
            onClick={() => navigate(`/hiring?stage=${stage}`)}
            aria-label={`View ${label} gigs`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
            />
            <span className="text-[28px] font-extrabold text-m3-on-surface tracking-tight leading-none">
              {count}
            </span>
            <span className="text-[11px] font-medium text-m3-on-surface-variant uppercase tracking-wider">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
