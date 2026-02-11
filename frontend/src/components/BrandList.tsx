/**
 * BrandList Component
 *
 * Displays available car brands as clickable cards/buttons.
 *
 * Usage:
 *   <BrandList brands={brands} onBrandClick={(id) => navigate(`/brand/${id}`)} />
 */

import { cn } from '@/lib/utils'
import type { Brand } from '@/types/cars'

export interface BrandListProps {
  brands: Brand[]
  selectedBrandId?: string
  onBrandClick?: (brandId: string | undefined) => void
  className?: string
}

export function BrandList({
  brands,
  selectedBrandId,
  onBrandClick,
  className,
}: BrandListProps) {
  return (
    <div
      className={cn('flex flex-wrap gap-3', className)}
      data-testid="brand-list"
    >
      {/* All Brands option */}
      <button
        onClick={() => onBrandClick?.(undefined)}
        className={cn(
          'flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2',
          'transition-all duration-[var(--motion-fast)]',
          'hover:shadow-[var(--shadow-sm)]',
          !selectedBrandId
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:border-[var(--color-border-hover)]'
        )}
        data-testid="brand-all"
      >
        <span className="font-medium">All Brands</span>
      </button>
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={() => onBrandClick?.(brand.id)}
          className={cn(
            'flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2',
            'transition-all duration-[var(--motion-fast)]',
            'hover:shadow-[var(--shadow-sm)]',
            selectedBrandId === brand.id
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:border-[var(--color-border-hover)]'
          )}
          data-testid={`brand-${brand.id}`}
        >
          {brand.logo_url && (
            <img
              src={brand.logo_url}
              alt={`${brand.name} logo`}
              className="h-6 w-6 object-contain"
            />
          )}
          <span className="font-medium">{brand.name}</span>
        </button>
      ))}
    </div>
  )
}
