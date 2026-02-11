/**
 * Input Component
 *
 * A versatile input component with label, placeholder, error state, and disabled state.
 *
 * Usage:
 *   <Input label="Email" placeholder="Enter email" />
 *   <Input label="Password" type="password" error="Password is required" />
 *   <Input disabled />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1.5',
              disabled ? 'text-[var(--color-muted)]' : 'text-[var(--color-fg)]'
            )}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm transition-colors',
            'bg-[var(--color-surface)] text-[var(--color-fg)]',
            'placeholder:text-[var(--color-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg)]',
            error
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-[var(--color-muted)]"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
