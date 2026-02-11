/**
 * Loading Components
 *
 * Loading indicators with spinner and skeleton variants.
 *
 * Usage:
 *   <LoadingSpinner />
 *   <LoadingSpinner size="lg" />
 *   <Skeleton className="h-4 w-32" />
 *   <SkeletonCard />
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Loading Spinner
const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || 'Loading'}
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <div
          className={cn(
            spinnerVariants({ size }),
            'text-[var(--color-accent)]'
          )}
        />
        {label && (
          <span className="ml-2 text-sm text-[var(--color-muted)]">{label}</span>
        )}
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    )
  }
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Skeleton
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-[var(--radius-md)] bg-[var(--color-border)]',
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

// Skeleton Card - pre-built skeleton for card layouts
const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4',
        className
      )}
      {...props}
    >
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
})
SkeletonCard.displayName = 'SkeletonCard'

// Skeleton Text - pre-built skeleton for text blocks
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 3, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
})
SkeletonText.displayName = 'SkeletonText'

// Full page loading overlay
export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, label = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'bg-[var(--color-bg)]/80 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-sm text-[var(--color-muted)]">{label}</p>
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = 'LoadingOverlay'

export {
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  LoadingOverlay,
  spinnerVariants,
}
