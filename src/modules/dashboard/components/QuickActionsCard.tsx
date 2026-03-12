import { Zap, PlusCircle, FileText, Users, Search, BarChart3, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@sicaho-collab/ui-web'

const QUICK_ACTIONS = [
  { label: 'Post a Gig',      icon: PlusCircle, route: '/hiring/new' },
  { label: 'View Invoices',   icon: FileText,   route: '/finance/invoices' },
  { label: 'Manage Team',     icon: Users,      route: '/organisation' },
  { label: 'Browse Students', icon: Search,     route: '/hiring' },
  { label: 'View Reports',    icon: BarChart3,  route: '/finance' },
  { label: 'Settings',        icon: Settings,   route: '/organisation' },
] as const

export default function QuickActionsCard() {
  const navigate = useNavigate()

  return (
    <Card variant="elevated" className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <Zap className="size-5 text-m3-primary shrink-0" />
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, route }) => (
            <Button
              key={label}
              variant="tonal"
              size="sm"
              className="justify-start gap-2 w-full"
              onClick={() => navigate(route)}
            >
              <Icon className="!size-4" />
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
