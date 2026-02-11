/**
 * ImageGallery Component
 *
 * Displays an image gallery with a main image and thumbnails.
 *
 * Usage:
 *   <ImageGallery images={car.images} />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CarImage } from '@/types/cars'

export interface ImageGalleryProps {
  images: CarImage[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  // Find primary image index or default to 0
  React.useEffect(() => {
    const primaryIndex = images.findIndex((img) => img.is_primary)
    if (primaryIndex !== -1) {
      setActiveIndex(primaryIndex)
    }
  }, [images])

  const activeImage = images[activeIndex]

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'flex aspect-[16/10] items-center justify-center rounded-[var(--radius-lg)]',
          'bg-[var(--color-bg)] text-[var(--color-muted)]',
          className
        )}
      >
        No images available
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg)]">
        {activeImage && (
          <img
            src={activeImage.image_url}
            alt={activeImage.alt_text}
            className="h-full w-full object-cover"
          />
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2',
                'bg-[var(--color-bg)]/80 text-[var(--color-fg)]',
                'transition-all hover:bg-[var(--color-bg)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]'
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2',
                'bg-[var(--color-bg)]/80 text-[var(--color-fg)]',
                'transition-all hover:bg-[var(--color-bg)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]'
              )}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-[var(--color-bg)]/80 px-2 py-1 text-xs text-[var(--color-fg)]">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex-shrink-0 overflow-hidden rounded-[var(--radius-md)]',
                'h-16 w-20 border-2 transition-all',
                activeIndex === index
                  ? 'border-[var(--color-accent)]'
                  : 'border-transparent hover:border-[var(--color-border-hover)]'
              )}
            >
              <img
                src={image.image_url}
                alt={image.alt_text}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
