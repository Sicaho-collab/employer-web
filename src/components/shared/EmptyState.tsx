interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div style={styles.container}>
      <span style={styles.icon} role="img" aria-hidden>{icon}</span>
      <p style={styles.title}>{title}</p>
      {description && <p style={styles.description}>{description}</p>}
      {action && (
        <button style={styles.button} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-12) var(--space-6)',
    gap: 'var(--space-3)',
    textAlign: 'center',
  },
  icon: {
    fontSize: 36,
    lineHeight: 1,
    marginBottom: 'var(--space-2)',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  description: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
    maxWidth: 320,
  },
  button: {
    marginTop: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-5)',
    background: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
