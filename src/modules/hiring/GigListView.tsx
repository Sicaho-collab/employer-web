import type { Gig, GigViewTab } from '@/types/gig'
import { GigStage } from '@/types/gig'
import GigCard from './GigCard'
import EmptyState from '@/components/shared/EmptyState'
import { useNavigate } from 'react-router-dom'

interface GigListViewProps {
  activeTab: GigViewTab
  gigs: Gig[]
}

// V3 tab -> filter mapping using computed lifecycle labels
function filterGigs(gigs: Gig[], tab: GigViewTab): Gig[] {
  switch (tab) {
    case 'ALL':         return gigs
    case 'DRAFT':       return gigs.filter(g => g.stage === GigStage.POSTED && !g.is_published)
    case 'HIRING':      return gigs.filter(g => g.stage === GigStage.POSTED && g.is_published)
    case 'SECURED':     return gigs.filter(g => g.stage === GigStage.MATCHED)
    case 'IN_PROGRESS': return gigs.filter(g => g.stage === GigStage.ACTIVE)
    case 'COMPLETED':   return gigs.filter(g => g.stage === GigStage.DONE)
    case 'CLOSED':      return gigs.filter(g => g.stage === GigStage.CLOSED)
    default:            return gigs
  }
}

// V3 empty state messaging per tab
const EMPTY_STATES: Record<GigViewTab, { icon: string; title: string; description: string }> = {
  ALL:         { icon: '📋', title: 'No gigs yet',                    description: 'Post your first gig to start finding talent on Alumable.' },
  DRAFT:       { icon: '📝', title: 'No drafts',                      description: 'Start a new gig and save it as a draft to continue later.' },
  HIRING:      { icon: '🔍', title: 'No gigs currently hiring',       description: 'Publish a gig to start receiving applicants.' },
  SECURED:     { icon: '🤝', title: 'No talent secured yet',          description: 'Once you accept an applicant and they confirm, they\'ll appear here.' },
  IN_PROGRESS: { icon: '⚡', title: 'No gigs in progress',            description: 'Gigs will appear here once the start date is reached.' },
  COMPLETED:   { icon: '✅', title: 'No gigs completed',              description: 'Gigs marked as complete will appear here for payment release.' },
  CLOSED:      { icon: '📁', title: 'No engagements closed',          description: 'Fully settled gigs will be archived here.' },
}

export default function GigListView({ activeTab, gigs }: GigListViewProps) {
  const navigate     = useNavigate()
  const filtered     = filterGigs(gigs, activeTab)

  if (filtered.length === 0) {
    const empty = EMPTY_STATES[activeTab]
    return (
      <EmptyState
        icon={empty.icon}
        title={empty.title}
        description={empty.description}
        action={{ label: 'Post a Gig', onClick: () => navigate('/hiring/new') }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((gig, i) => (
        <div
          key={gig.id}
          className="animate-[fadeInUp_0.4s_ease-out_both]"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <GigCard gig={gig} />
        </div>
      ))}
    </div>
  )
}
