/**
 * CarDetail Component
 *
 * Displays full car information with image gallery, specs, and inquiry form.
 *
 * Usage:
 *   <CarDetail car={car} />
 */

import { cn } from '@/lib/utils'
import { Badge, Card } from '@/components/ui'
import { ImageGallery } from './ImageGallery'
import { InquiryForm } from './InquiryForm'
import { ArrowLeft, Calendar, DollarSign, Info } from 'lucide-react'
import type { Car } from '@/types/cars'

export interface CarDetailProps {
  car: Car
  onBack?: () => void
  className?: string
}

function formatPrice(price: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(price))
}

function getStatusVariant(status: Car['status']): 'success' | 'error' | 'info' {
  switch (status) {
    case 'active':
      return 'success'
    case 'sold':
      return 'error'
    default:
      return 'info'
  }
}

export function CarDetail({ car, onBack, className }: CarDetailProps) {
  return (
    <div className={cn('space-y-8', className)} data-testid="car-detail">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className={cn(
            'inline-flex items-center gap-2 text-sm text-[var(--color-muted)]',
            'transition-colors hover:text-[var(--color-fg)]'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </button>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column - Image and Description */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={car.images} />

          {/* Title and badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getStatusVariant(car.status)}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </Badge>
              {car.is_featured && <Badge variant="warning">Featured</Badge>}
            </div>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {car.brand.name}
            </p>
            <h1 className="text-3xl font-bold text-[var(--color-fg)]">
              {car.model}
            </h1>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-[var(--color-muted)]">
              <Calendar className="h-5 w-5" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-accent)]">
              <DollarSign className="h-5 w-5" />
              <span className="text-xl font-bold">{formatPrice(car.price)}</span>
            </div>
          </div>

          {/* Description */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-[var(--color-muted)]" />
              <h2 className="font-semibold text-[var(--color-fg)]">Description</h2>
            </div>
            <p className="text-[var(--color-fg)] whitespace-pre-line">
              {car.description}
            </p>
          </Card>
        </div>

        {/* Right column - Inquiry Form */}
        <div className="lg:col-span-1">
          <Card
            title="Interested in this car?"
            description="Send us an inquiry and we'll get back to you."
            className="sticky top-4"
          >
            <InquiryForm carId={car.id} />
          </Card>
        </div>
      </div>
    </div>
  )
}
