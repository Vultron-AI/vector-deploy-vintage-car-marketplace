/**
 * InquiryForm Component
 *
 * Contact form for car inquiries with validation.
 *
 * Usage:
 *   <InquiryForm carId={car.id} onSuccess={() => setSubmitted(true)} />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui'
import { activeApi } from '@/services/carsApi'
import { getErrorMessage } from '@/services/api'
import type { InquiryForm as InquiryFormData } from '@/types/cars'

export interface InquiryFormProps {
  carId: string
  onSuccess?: () => void
  className?: string
}

interface FormErrors {
  collector_name?: string
  collector_email?: string
  message?: string
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function InquiryForm({ carId, onSuccess, className }: InquiryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<InquiryFormData>({
    car: carId,
    collector_name: '',
    collector_email: '',
    collector_phone: '',
    message: '',
  })
  const [errors, setErrors] = React.useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.collector_name.trim()) {
      newErrors.collector_name = 'Name is required'
    }

    if (!formData.collector_email.trim()) {
      newErrors.collector_email = 'Email is required'
    } else if (!validateEmail(formData.collector_email)) {
      newErrors.collector_email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await activeApi.submitInquiry(formData)
      toast({
        title: 'Inquiry Sent!',
        description: 'We will get back to you as soon as possible.',
        variant: 'success',
      })
      // Reset form
      setFormData({
        car: carId,
        collector_name: '',
        collector_email: '',
        collector_phone: '',
        message: '',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Failed to send inquiry',
        description: getErrorMessage(error),
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      data-testid="inquiry-form"
    >
      <Input
        label="Your Name"
        name="collector_name"
        placeholder="John Smith"
        value={formData.collector_name}
        onChange={handleChange}
        error={errors.collector_name}
        disabled={isSubmitting}
        required
      />

      <Input
        label="Email Address"
        name="collector_email"
        type="email"
        placeholder="john@example.com"
        value={formData.collector_email}
        onChange={handleChange}
        error={errors.collector_email}
        disabled={isSubmitting}
        required
      />

      <Input
        label="Phone Number (Optional)"
        name="collector_phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={formData.collector_phone || ''}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <div className="w-full">
        <label
          htmlFor="message"
          className={cn(
            'block text-sm font-medium mb-1.5',
            isSubmitting ? 'text-[var(--color-muted)]' : 'text-[var(--color-fg)]'
          )}
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="I'm interested in this car and would like to learn more..."
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          className={cn(
            'w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm transition-colors',
            'bg-[var(--color-surface)] text-[var(--color-fg)]',
            'placeholder:text-[var(--color-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg)]',
            'resize-none',
            errors.message
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
          )}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          required
        />
        {errors.message && (
          <p
            id="message-error"
            className="mt-1.5 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  )
}
