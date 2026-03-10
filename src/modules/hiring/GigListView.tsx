import type { Gig, GigViewTab } from '@/types/gig'
import { GigStage } from '@/types/gig'
import GigCard from './GigCard'
import EmptyState from '@/components/shared/EmptyState'
import { useNavigate } from 'react-router-dom'

interface GigListViewProps {
  activeTab: GigViewTab
  gigs: Gig[]
}

// Derive filtered list from active tab — pure function, no side effects
function filterGigs(gigs: Gig[], tab: GigViewTab): Gig[] {
  switch (tab) {
    case 'ALL':    return gigs
    case 'DRAFT':  return gigs.filter(g => g.stage === GigStage.POSTED && !g.is_published)
    case 'POSTED': return gigs.filter(g => g.stage === GigStage.POSTED  && g.is_published)
    case 'ACTIVE': return gigs.filter(g => g.stage === GigStage.ACTIVE)
    case 'DONE':   return gigs.filter(g => g.stage === GigStage.DONE)
    case 'CLOSED': return gigs.filter(g => g.stage === GigStage.CLOSED)
    default:       return gigs
  }
}

export default function GigListView({ activeTab, gigs }: GigListViewProps) {
  const navigate     = useNavigate()
  const filtered     = filterGigs(gigs, activeTab)

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No gigs in this view"
        description="Post a new gig to start finding talent."
        action={{ label: 'Post a Gig', onClick: () => navigate('/hiring/new') }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
