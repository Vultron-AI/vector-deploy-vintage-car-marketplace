/**
 * CarCard Component
 *
 * Displays a car card with thumbnail, make, model, year, price, and hover effects.
 *
 * Usage:
 *   <CarCard car={car} onClick={() => navigate(`/car/${car.id}`)} />
 */

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import type { CarListItem } from '@/types/cars'

export interface CarCardProps {
  car: CarListItem
  onClick?: () => void
  className?: string
}

function formatPrice(price: string): string {
  const numPrice = parseFloat(price)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice)
}

export function CarCard({ car, onClick, className }: CarCardProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-[var(--radius-lg)]',
        'border border-[var(--color-border)] bg-[var(--color-surface)]',
        'shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-fast)]',
        'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-hover)]',
        className
      )}
      data-testid={`car-card-${car.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg)]">
        {car.primary_image ? (
          <img
            src={car.primary_image}
            alt={`${car.brand.name} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-[var(--motion-normal)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-muted)]">
            No image available
          </div>
        )}
        {/* Featured badge */}
        {car.is_featured && (
          <Badge
            variant="warning"
            className="absolute left-3 top-3"
          >
            Featured
          </Badge>
        )}
        {/* Status badge */}
        {car.status !== 'active' && (
          <Badge
            variant={car.status === 'sold' ? 'error' : 'info'}
            className="absolute right-3 top-3"
          >
            {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[var(--color-muted)]">{car.brand.name}</p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--color-fg)]">
          {car.model}
        </h3>
        <p className="text-sm text-[var(--color-muted)]">{car.year}</p>
        <p className="mt-3 text-xl font-bold text-[var(--color-accent)]">
          {formatPrice(car.price)}
        </p>
      </div>
    </article>
  )
}
