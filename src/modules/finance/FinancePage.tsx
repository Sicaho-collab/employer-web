import { Outlet, NavLink } from 'react-router-dom'
import PageHeader from '@/components/ui/PageHeader'

const FINANCE_TABS = [
  { to: 'transactions', label: 'Transactions' },
  { to: 'invoices',     label: 'Invoices'     },
  { to: 'refunds',      label: 'Refunds'      },
] as const

export default function FinancePage() {
  return (
    <div style={styles.page}>
      <PageHeader
        title="Finance"
        subtitle="All payments, invoices, and refunds — each linked to a Gig."
      />

      {/* ── Sub-navigation ── */}
      <nav style={styles.tabNav}>
        {FINANCE_TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) =>
              isActive ? { ...styles.tab, ...styles.tabActive } : styles.tab
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Tab content ── */}
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 'var(--content-max-w)',
    margin: '0 auto',
    padding: 'var(--space-6) var(--space-4)',
  },
  tabNav: {
    display: 'flex',
    gap: 'var(--space-1)',
    borderBottom: '1px solid var(--color-border)',
    marginBottom: 'var(--space-6)',
    overflowX: 'auto',
  },
  tab: {
    display: 'inline-block',
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    background: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: -1,
    textDecoration: 'none',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--color-primary)',
    borderBottomColor: 'var(--color-primary)',
    fontWeight: 600,
  },
  content: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    boxShadow: 'var(--shadow-sm)',
    minHeight: 300,
  },
}
