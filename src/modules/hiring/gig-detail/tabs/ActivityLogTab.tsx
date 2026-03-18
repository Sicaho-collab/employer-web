// Activity Log Tab — append-only audit trail of events for this Gig.
import type { ActivityEvent } from '@/types/gig'

// Placeholder events — replace with Gig-scoped fetch
const EVENTS: ActivityEvent[] = [
  { id: 'e1', gig_id: 'g1', event_type: 'GIG_POSTED',       actor: 'EMPLOYER', description: 'Gig published and live.',              occurred_at: '2025-01-15T09:00:00Z' },
  { id: 'e2', gig_id: 'g1', event_type: 'APPLICANT_ADDED',  actor: 'SYSTEM',   description: 'Alex Chen submitted an application.',   occurred_at: '2025-01-16T11:30:00Z' },
  { id: 'e3', gig_id: 'g1', event_type: 'APPLICANT_ADDED',  actor: 'SYSTEM',   description: 'Priya Rajan submitted an application.', occurred_at: '2025-01-17T14:00:00Z' },
  { id: 'e4', gig_id: 'g1', event_type: 'STUDENT_MATCHED',  actor: 'EMPLOYER', description: 'Alex Chen selected as matched talent.',  occurred_at: '2025-01-20T10:00:00Z' },
  { id: 'e5', gig_id: 'g1', event_type: 'STAGE_ADVANCED',   actor: 'SYSTEM',   description: 'Stage advanced: POSTED → MATCHED.',     occurred_at: '2025-01-20T10:01:00Z' },
]

const ACTOR_COLOR: Record<ActivityEvent['actor'], string> = {
  EMPLOYER: 'var(--color-primary)',
  SYSTEM:   'var(--color-text-muted)',
  STUDENT:  'var(--color-success)',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-SG', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ActivityLogTab() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Activity Log</h2>
      <p style={styles.note}>Append-only. All events are system-recorded.</p>

      <ol style={styles.timeline}>
        {[...EVENTS].reverse().map((event, i) => (
          <li key={event.id} style={styles.event}>
            {/* Timeline dot + line */}
            <div style={styles.dotCol}>
              <div style={{ ...styles.dot, background: ACTOR_COLOR[event.actor] }} />
              {i < EVENTS.length - 1 && <div style={styles.line} />}
            </div>

            {/* Event content */}
            <div style={styles.content}>
              <div style={styles.eventHeader}>
                <span style={styles.eventType}>{event.event_type.replaceAll('_', ' ')}</span>
                <span style={{ ...styles.actor, color: ACTOR_COLOR[event.actor] }}>
                  {event.actor}
                </span>
              </div>
              <p style={styles.description}>{event.description}</p>
              <time style={styles.time}>{formatDate(event.occurred_at)}</time>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    paddingBottom: 'var(--space-3)',
    borderBottom: '1px solid var(--color-border)',
  },
  note: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    marginTop: 'calc(-1 * var(--space-3))',
  },
  timeline: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  event: {
    display: 'flex',
    gap: 'var(--space-4)',
  },
  dotCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    width: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 3,
  },
  line: {
    width: 2,
    flex: 1,
    background: 'var(--color-border)',
    minHeight: 24,
    marginTop: 4,
  },
  content: {
    paddingBottom: 'var(--space-5)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
  },
  eventHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  eventType: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    textTransform: 'capitalize',
    letterSpacing: '-0.01em',
  },
  actor: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  description: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
  },
  time: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
  },
}
