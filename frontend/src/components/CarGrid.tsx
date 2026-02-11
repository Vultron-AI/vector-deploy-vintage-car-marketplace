/**
 * CarGrid Component
 *
 * Displays car cards in a responsive grid layout.
 *
 * Usage:
 *   <CarGrid cars={cars} onCarClick={(car) => navigate(`/car/${car.id}`)} />
 */

import { cn } from '@/lib/utils'
import { CarCard } from './CarCard'
import { EmptyState, SkeletonCard } from '@/components/ui'
import { Car as CarIcon } from 'lucide-react'
import type { CarListItem } from '@/types/cars'

export interface CarGridProps {
  cars: CarListItem[]
  isLoading?: boolean
  onCarClick?: (car: CarListItem) => void
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function CarGrid({
  cars,
  isLoading = false,
  onCarClick,
  emptyTitle = 'No cars found',
  emptyDescription = 'Try adjusting your filters or check back later for new listings.',
  className,
}: CarGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}
        data-testid="car-grid-loading"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="aspect-auto h-auto" />
        ))}
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={<CarIcon />}
        title={emptyTitle}
        description={emptyDescription}
        data-testid="car-grid-empty"
      />
    )
  }

  return (
    <div
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
      data-testid="car-grid"
    >
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          onClick={() => onCarClick?.(car)}
        />
      ))}
    </div>
  )
}
