import { useNavigate } from 'react-router-dom'
import type { Gig } from '@/types/gig'
import { GigStage } from '@/types/gig'
import StageBadge from '@/components/ui/StageBadge'
import { getGigCTA, getGigAttentionInfo, getOfferDisplayConfig } from '@/utils/gigDisplay'
import { Card, Button, Icon } from '@sicaho-collab/ui-web'
import { cn } from '@/lib/utils'

interface GigCardProps {
  gig: Gig
}

export default function GigCard({ gig }: GigCardProps) {
  const navigate    = useNavigate()
  const ctaLabel    = getGigCTA(gig)
  const attention   = getGigAttentionInfo(gig)
  const isError     = attention.hasError
  const offerConfig = getOfferDisplayConfig(gig)

  const isActiveGig = gig.stage === GigStage.ACTIVE

  const handleClick = () => navigate(`/hiring/${gig.id}`)
  const onCta       = () => navigate(`/hiring/${gig.id}`)

  return (
    <Card
      variant="outlined"
      className={cn(
        "group relative cursor-pointer overflow-hidden",
        "bg-m3-surface border border-m3-outline-variant/60 shadow-soft rounded-m3-md",
        "transition-all duration-200 ease-out",
        "hover:shadow-m3-1 hover:-translate-y-0.5",
        isError && "border-red-300"
      )}
      onClick={handleClick}
    >
      <div className="px-4 py-3 md:px-5 md:py-4">
        {/* ── Error banner ── */}
        {isError && (
          <div role="alert" className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-m3-xs bg-red-50 border border-red-200">
            <Icon name="warning" size={14} className="text-red-500 flex-shrink-0" />
            <span className="text-xs font-medium text-red-700">{attention.message}</span>
          </div>
        )}

        {/* ── Row: title + CTA (always visible) ── */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-m3-on-surface leading-snug min-w-0 truncate transition-colors duration-200 group-hover:text-m3-primary">
            {gig.title}
          </h3>
          <Button
            variant={isError ? 'tonal' : isActiveGig ? 'filled' : 'filled'}
            size="sm"
            onClick={e => { e.stopPropagation(); onCta() }}
            className={cn(
              "flex-shrink-0",
              isError && 'text-m3-error',
              isActiveGig && 'bg-emerald-600 hover:bg-emerald-700'
            )}
          >
            {ctaLabel}
          </Button>
        </div>

        {/* ── Meta row: badges, timeline, applicants ── */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <StageBadge gig={gig} />
          {offerConfig && (
            <span
              style={{ background: offerConfig.bg, color: offerConfig.color }}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide"
            >
              {offerConfig.label}
            </span>
          )}
          {gig.start_date && (
            <div className="flex items-center gap-1.5 text-xs text-m3-on-surface-variant">
              <Icon name="calendar_today" size={14} />
              <span>{gig.start_date}{gig.end_date ? ` \u2192 ${gig.end_date}` : ''}</span>
            </div>
          )}
          {gig.stage === GigStage.POSTED && gig.is_published && (
            <div className="flex items-center gap-1.5 text-xs text-m3-on-surface-variant">
              <Icon name="groups" size={14} />
              <span>{gig.applicant_count} applicant{gig.applicant_count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
