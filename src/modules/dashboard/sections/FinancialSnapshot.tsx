// High-level financial summary only — not analytics-heavy.
// Numbers reference Gig-linked payments.

interface FinanceStat {
  label: string
  value: string
  note?: string
}

// Placeholder values — replace with aggregated finance query
const STATS: FinanceStat[] = [
  { label: 'Pending Release',      value: '$4,200',  note: '3 gigs awaiting payment'  },
  { label: 'Paid This Month',      value: '$12,800', note: 'Across 8 completed gigs'  },
  { label: 'Outstanding Invoices', value: '$1,500',  note: '2 invoices overdue'       },
]

export default function FinancialSnapshot() {
  return (
    <section className="bg-m3-surface border border-m3-outline-variant rounded-m3-md p-5 shadow-m3-1">
      <h2 className="text-base font-bold text-m3-on-surface mb-4">
        Financial Snapshot
      </h2>
      <div className="flex flex-col gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 p-4 bg-m3-surface-container-low border border-m3-outline-variant rounded-m3-md"
          >
            <p className="text-[22px] font-extrabold text-m3-on-surface tracking-tight">
              {stat.value}
            </p>
            <p className="text-sm font-semibold text-m3-on-surface-variant">
              {stat.label}
            </p>
            {stat.note && (
              <p className="text-xs text-m3-on-surface-variant/70">
                {stat.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
