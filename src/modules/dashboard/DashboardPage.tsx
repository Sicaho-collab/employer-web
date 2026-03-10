import { Clock, AlertCircle, Zap, PlusCircle, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/modules/auth/AuthContext'
import GreetingHeader from './components/GreetingHeader'

const QUICK_ACTIONS = [
  { label: 'Post a Gig',    icon: PlusCircle, route: '/hiring/new' },
  { label: 'View Invoices', icon: Receipt,    route: '/finance/invoices' },
] as const

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const firstName = user?.fullName?.split(' ')[0]

  return (
    <div className="flex min-h-[calc(100vh-var(--nav-height))] flex-col items-center justify-center px-4 md:px-6 py-6 md:py-8">
      <GreetingHeader firstName={firstName} />

      <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[11rem] max-w-[1100px] w-full">
        {/* Continue — purple neon gradient border */}
        {/* Continue — yellow neon gradient border */}
        <div className="rounded-m3-md bg-gradient-to-br from-[#FACC15] via-[#EAB308] to-[#A16207] p-[2px]">
          <BentoCard
            name="Continue where I left off"
            className="col-span-1 bg-m3-surface rounded-[10px] h-full"
            iconClassName="text-[#FACC15]"
            titleClassName="text-m3-on-surface"
            Icon={Clock}
            description="Pick up your most recent drafts, reviews, and in-progress agreements."
            href="/dashboard/recent"
            cta="View recent activity"
            tag="Recent"
            tagClassName="border border-[#FACC15] text-[#FACC15] bg-[#FACC15]/10"
            hoverClassName="group-hover:bg-[#FACC15]/[.06]"
          />
        </div>

        {/* Attention — pink neon gradient border */}
        {/* Attention — purple neon gradient border */}
        <div className="rounded-m3-md bg-gradient-to-br from-[#9A76BE] via-[#7C3AED] to-[#4C1D95] p-[2px]">
          <BentoCard
            name="Needs your attention"
            className="col-span-1 bg-m3-surface rounded-[10px] h-full"
            iconClassName="text-m3-primary"
            titleClassName="text-m3-on-surface"
            Icon={AlertCircle}
            description="Expiring gigs, pending applications, and overdue items that need action."
            href="/dashboard/attention"
            cta="Review items"
            tag="Alerts"
            tagClassName="border border-m3-primary text-m3-primary bg-m3-primary/10"
            hoverClassName="group-hover:bg-m3-primary/[.06]"
          />
        </div>

        {/* Quick actions — mauve neon gradient border */}
        {/* Quick actions — blue neon gradient border */}
        <div className="rounded-m3-md bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1E3A8A] p-[2px]">
          <BentoCard
            name="Quick actions"
            className="col-span-1 bg-m3-surface rounded-[10px] h-full"
            iconClassName="text-[#3B82F6]"
            titleClassName="text-m3-on-surface"
            Icon={Zap}
            description="Common shortcuts to get things done fast."
            tag="Quick"
            tagClassName="border border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10"
            hoverClassName="group-hover:bg-[#3B82F6]/[.06]"
            ctaContent={
              <>
                {QUICK_ACTIONS.map(({ label, icon: Icon, route }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className="pointer-events-auto gap-1.5"
                    onClick={() => navigate(route)}
                  >
                    <Icon className="!size-4" />
                    {label}
                  </Button>
                ))}
              </>
            }
          />
        </div>
      </BentoGrid>
    </div>
  )
}
