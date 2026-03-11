import { useNavigate } from 'react-router-dom'
import type { Gig } from '@/types/gig'
import StageBadge from '@/components/ui/StageBadge'
import PaymentStatusBadge from '@/components/ui/PaymentStatusBadge'
import { getGigCTA, getGigAttentionInfo } from '@/utils/gigDisplay'
import { Card, Button } from '@sicaho-collab/m3-design-system'
import { cn } from '@/lib/utils'

interface GigCardProps {
  gig: Gig
}

export default function GigCard({ gig }: GigCardProps) {
  const navigate    = useNavigate()
  const ctaLabel    = getGigCTA(gig)
  const attention   = getGigAttentionInfo(gig)
  const isError     = attention.hasError

  const handleClick = () => navigate(`/hiring/${gig.id}`)
  const onCta       = () => navigate(`/hiring/${gig.id}`)

  return (
    <Card
      variant="outlined"
      className={cn(
        "group relative p-4 md:p-5 flex flex-col gap-4 cursor-pointer overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-m3-2",
        isError && "border-red-200"
      )}
      onClick={handleClick}
    >
      {/* ── Error / Attention Banner ── */}
      {attention.hasError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-m3-xs px-3 py-2">
          <span className="text-xs text-red-700 leading-relaxed">{attention.message}</span>
        </div>
      )}

      {/* ── Card Header: title + id ── */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-m3-on-surface leading-snug transition-colors duration-200 group-hover:text-m3-primary">
          {gig.title}
        </h3>
        <span className="text-xs text-m3-on-surface-variant font-mono bg-m3-surface-container rounded px-1.5 py-0.5 flex-shrink-0">
          {gig.id}
        </span>
      </div>

      {/* ── Badges + Timeline ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <StageBadge gig={gig} />
          <PaymentStatusBadge status={gig.payment_status} />
        </div>
        {gig.start_date && (
          <span className="text-xs border border-m3-outline-variant rounded-m3-full px-2 py-0.5 text-m3-on-surface-variant">
            {gig.start_date}{gig.end_date ? ` → ${gig.end_date}` : ''}
          </span>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="flex flex-wrap gap-4 text-xs text-m3-on-surface-variant">
        <span>
          Applicants: <strong className="text-m3-on-surface font-medium">{gig.applicant_count}</strong>
        </span>
        {gig.matched_student_id && (
          <span>
            Match: <strong className="text-m3-on-surface font-medium">Talent matched</strong>
          </span>
        )}
      </div>

      {/* ── Primary CTA — slides up on hover ── */}
      <div className={cn(
        "pt-3 border-t border-m3-outline-variant",
        "translate-y-2 opacity-0 transition-all duration-300 ease-out",
        "group-hover:translate-y-0 group-hover:opacity-100"
      )}>
        <Button
          variant={isError ? 'tonal' : 'filled'}
          size="sm"
          onClick={e => { e.stopPropagation(); onCta() }}
          className={isError ? 'text-m3-error' : ''}
        >
          {ctaLabel} →
        </Button>
      </div>
    </Card>
  )
}
