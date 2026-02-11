/**
 * Card Component
 *
 * A content container with optional title, description, and footer.
 *
 * Usage:
 *   <Card>Content</Card>
 *   <Card title="Title" description="Description">Content</Card>
 *   <Card footer={<Button>Action</Button>}>Content</Card>
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-lg)] border border-[var(--color-border)]',
          'bg-[var(--color-surface)] shadow-[var(--shadow-sm)]',
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="border-b border-[var(--color-border)] p-4">
            {title && (
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="p-4">{children}</div>
        {footer && (
          <div className="border-t border-[var(--color-border)] p-4">
            {footer}
          </div>
        )}
      </div>
    )
  }
)
Card.displayName = 'Card'

// Individual card parts for more flexibility
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-b border-[var(--color-border)] p-4', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold text-[var(--color-fg)]', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-sm text-[var(--color-muted)]', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-[var(--color-border)] p-4', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
