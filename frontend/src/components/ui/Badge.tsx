/**
 * Badge Component
 *
 * A small label component with multiple variants for status indication.
 *
 * Usage:
 *   <Badge>Default</Badge>
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="error">Error</Badge>
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)]',
        success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20',
        warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20',
        error: 'bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20',
        info: 'bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
