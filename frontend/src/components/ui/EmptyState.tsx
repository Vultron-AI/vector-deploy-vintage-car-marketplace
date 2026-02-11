/**
 * EmptyState Component
 *
 * Displays a message when content is empty or unavailable.
 * Includes optional icon, title, description, and call-to-action.
 *
 * Usage:
 *   <EmptyState
 *     icon={<InboxIcon />}
 *     title="No items"
 *     description="Create your first item to get started."
 *     action={<Button>Create Item</Button>}
 *   />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-[var(--color-muted)]">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                  className: cn(
                    'h-12 w-12',
                    (icon as React.ReactElement<{ className?: string }>).props.className
                  ),
                })
              : icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-[var(--color-fg)]">{title}</h3>
        {description && (
          <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'

export { EmptyState }
