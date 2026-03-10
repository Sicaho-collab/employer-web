import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium',
  {
    variants: {
      variant: {
        small: 'size-[6px] rounded-full bg-m3-error',
        large: 'min-w-4 h-4 px-1 rounded-full bg-m3-error text-m3-on-error text-[11px]',
      },
    },
    defaultVariants: {
      variant: 'large',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  count?: number
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, count, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      aria-label={count !== undefined ? `${count} notifications` : 'notification'}
      {...props}
    >
      {variant === 'large' && count !== undefined && (count > 999 ? '999+' : count)}
    </span>
  )
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
