/**
 * HomePage Component
 *
 * Landing page showing featured cars and brand list.
 *
 * Usage:
 *   <HomePage />
 */

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandList } from '@/components/BrandList'
import { CarGrid } from '@/components/CarGrid'
import { activeApi } from '@/services/carsApi'
import type { Brand, CarListItem } from '@/types/cars'

export function HomePage() {
  const navigate = useNavigate()
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [featuredCars, setFeaturedCars] = React.useState<CarListItem[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = React.useState(true)
  const [isLoadingCars, setIsLoadingCars] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, carsData] = await Promise.all([
          activeApi.getBrands(),
          activeApi.getCars({ featured: true }),
        ])
        setBrands(brandsData)
        setFeaturedCars(carsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoadingBrands(false)
        setIsLoadingCars(false)
      }
    }
    fetchData()
  }, [])

  const handleBrandClick = (brandId: string | undefined) => {
    if (brandId) {
      navigate(`/brand/${brandId}`)
    } else {
      navigate('/brand/all')
    }
  }

  const handleCarClick = (car: CarListItem) => {
    navigate(`/car/${car.id}`)
  }

  return (
    <div className="space-y-12" data-testid="home-page">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-fg)] md:text-5xl">
          Vintage Car Marketplace
        </h1>
        <p className="mt-4 text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
          Discover extraordinary vintage automobiles from the world's most prestigious marques.
          Each vehicle in our collection has been carefully curated for discerning collectors.
        </p>
      </section>

      {/* Browse by Brand */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--color-fg)] mb-6">
          Browse by Brand
        </h2>
        {isLoadingBrands ? (
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-border)]"
              />
            ))}
          </div>
        ) : (
          <BrandList brands={brands} onBrandClick={handleBrandClick} />
        )}
      </section>

      {/* Featured Cars */}
      <section>
        <h2 className="text-2xl font-semibold text-[var(--color-fg)] mb-6">
          Featured Vehicles
        </h2>
        <CarGrid
          cars={featuredCars}
          isLoading={isLoadingCars}
          onCarClick={handleCarClick}
          emptyTitle="No featured cars"
          emptyDescription="Check back soon for featured listings."
        />
      </section>

      {/* View All CTA */}
      <section className="text-center">
        <button
          onClick={() => navigate('/brand/all')}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          View All Vehicles
        </button>
      </section>
    </div>
  )
}
