import { NavLink } from 'react-router-dom'

export interface TabItem {
  to: string
  label: string
  count?: number
}

interface TabNavProps {
  tabs: TabItem[]
}

export default function TabNav({ tabs }: TabNavProps) {
  return (
    <nav style={styles.nav} role="tablist">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          role="tab"
          style={({ isActive }) =>
            isActive ? { ...styles.tab, ...styles.tabActive } : styles.tab
          }
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={styles.count}>{tab.count}</span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    gap: 'var(--space-1)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: 0,
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    borderBottom: '2px solid transparent',
    marginBottom: -1,
    transition: 'color 0.15s, border-color 0.15s',
    cursor: 'pointer',
  },
  tabActive: {
    color: 'var(--color-primary)',
    borderBottomColor: 'var(--color-primary)',
    fontWeight: 600,
  },
  count: {
    background: 'var(--color-border)',
    color: 'var(--color-text-secondary)',
    borderRadius: 100,
    padding: '0 6px',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '18px',
  },
}
