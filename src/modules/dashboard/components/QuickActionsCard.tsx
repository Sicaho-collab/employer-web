import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Button, Icon } from '@sicaho-collab/ui-web'

const QUICK_ACTIONS = [
  { label: 'Post a Gig',      icon: 'add_circle',  route: '/hiring/new' },
  { label: 'View Invoices',   icon: 'description',  route: '/finance/invoices' },
  { label: 'Manage Team',     icon: 'groups',       route: '/organisation' },
  { label: 'Browse Students', icon: 'search',       route: '/hiring' },
  { label: 'View Reports',    icon: 'bar_chart',    route: '/finance' },
  { label: 'Settings',        icon: 'settings',     route: '/organisation' },
]

export default function QuickActionsCard() {
  const navigate = useNavigate()

  return (
    <Card variant="elevated" className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon name="auto_awesome" size={20} className="text-m3-primary shrink-0" />
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map(({ label, icon, route }) => (
            <Button
              key={label}
              variant="tonal"
              size="sm"
              className="justify-start gap-2 w-full"
              onClick={() => navigate(route)}
            >
              <Icon name={icon} />
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
