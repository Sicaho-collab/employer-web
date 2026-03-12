import { useState, useRef, useEffect, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, Briefcase, Wallet, Building2 } from 'lucide-react'
import { NavigationRail, Card, Button } from '@sicaho-collab/ui-web'
import type { NavRailItem } from '@sicaho-collab/ui-web'

// Top-level navigation — max 4 modules per IA spec
const NAV_ITEMS: { to: string; label: string; icon: React.ReactNode }[] = [
  { to: '/dashboard',    label: 'Dashboard',    icon: <LayoutDashboard className="size-6" /> },
  { to: '/hiring',       label: 'Hiring',       icon: <Briefcase className="size-6" /> },
  { to: '/finance',      label: 'Finance',      icon: <Wallet className="size-6" /> },
  { to: '/organisation', label: 'Organisation', icon: <Building2 className="size-6" /> },
]

const railItems: NavRailItem[] = NAV_ITEMS.map(({ label, icon }) => ({ label, icon }))

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [railExpanded, setRailExpanded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Determine active nav index from current path
  const activeIndex = NAV_ITEMS.findIndex(item =>
    location.pathname.startsWith(item.to)
  )

  const handleNavSelect = (index: number) => {
    navigate(NAV_ITEMS[index].to)
  }

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [menuOpen, closeMenu])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, closeMenu])

  const handleSignOut = () => {
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#ECEEF1' }}>
      {/* ── Left Sidebar: NavigationRail ── */}
      <NavigationRail
        items={railItems}
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        onSelect={handleNavSelect}
        expanded={railExpanded}
        onExpandedChange={setRailExpanded}
      />

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-[60px] flex items-center justify-between px-4 md:px-6" style={{ background: '#ECEEF1' }}>
          <img
            src={`${import.meta.env.BASE_URL}alumable-horizontal.png`}
            alt="Alumable"
            className="h-7"
          />
          <div className="relative" ref={menuRef}>
            <button
              ref={triggerRef}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="User menu"
              className="w-9 h-9 rounded-full bg-m3-primary flex items-center justify-center text-m3-on-primary text-sm font-bold cursor-pointer transition-shadow hover:shadow-m3-1"
            >
              EH
            </button>

            {menuOpen && (
              <Card
                variant="elevated"
                role="menu"
                className="absolute right-0 top-full mt-2 w-[240px] z-50"
              >
                <div className="p-4 flex flex-col gap-1">
                  <p className="text-sm font-medium text-m3-on-surface">Employer User</p>
                  <p className="text-xs text-m3-on-surface-variant">employer@example.com</p>
                </div>
                <hr className="border-m3-outline-variant" />
                <div className="p-2">
                  <Button
                    variant="text"
                    size="sm"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 bg-white rounded-t-2xl min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
