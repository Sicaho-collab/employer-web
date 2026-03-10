function getGreeting(firstName?: string): string {
  const hour = new Date().getHours()
  const name = firstName || 'back'
  const prefix = firstName ? '' : 'Welcome '

  if (hour >= 5 && hour < 12) return firstName ? `Good morning, ${name}` : `${prefix}${name}`
  if (hour >= 12 && hour < 17) return firstName ? `Good afternoon, ${name}` : `${prefix}${name}`
  return firstName ? `Good evening, ${name}` : `${prefix}${name}`
}

interface GreetingHeaderProps {
  firstName?: string
}

export default function GreetingHeader({ firstName }: GreetingHeaderProps) {
  return (
    <div className="mb-10 text-center">
      <h1 className="text-[36px] md:text-[44px] font-bold text-m3-on-surface tracking-tight">
        {getGreeting(firstName)}
      </h1>
      <p className="text-[var(--text-md)] text-m3-on-surface-variant mt-3">
        What would you like to do today?
      </p>
    </div>
  )
}
