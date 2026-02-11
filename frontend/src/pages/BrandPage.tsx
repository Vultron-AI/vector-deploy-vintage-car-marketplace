/**
 * BrandPage Component
 *
 * Displays cars filtered by brand.
 *
 * Usage:
 *   <BrandPage />
 */

import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BrandList } from '@/components/BrandList'
import { CarGrid } from '@/components/CarGrid'
import { activeApi } from '@/services/carsApi'
import { ArrowLeft } from 'lucide-react'
import type { Brand, CarListItem } from '@/types/cars'

export function BrandPage() {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [cars, setCars] = React.useState<CarListItem[]>([])
  const [currentBrand, setCurrentBrand] = React.useState<Brand | null>(null)
  const [isLoadingBrands, setIsLoadingBrands] = React.useState(true)
  const [isLoadingCars, setIsLoadingCars] = React.useState(true)

  const isAllBrands = brandId === 'all' || !brandId

  // Fetch brands
  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await activeApi.getBrands()
        setBrands(data)
      } catch (error) {
        console.error('Failed to fetch brands:', error)
      } finally {
        setIsLoadingBrands(false)
      }
    }
    fetchBrands()
  }, [])

  // Fetch cars based on brand
  React.useEffect(() => {
    const fetchCars = async () => {
      setIsLoadingCars(true)
      try {
        if (isAllBrands) {
          const data = await activeApi.getCars()
          setCars(data)
          setCurrentBrand(null)
        } else {
          const [carsData, brandData] = await Promise.all([
            activeApi.getCars({ brand: brandId }),
            activeApi.getBrand(brandId!),
          ])
          setCars(carsData)
          setCurrentBrand(brandData)
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error)
      } finally {
        setIsLoadingCars(false)
      }
    }
    fetchCars()
  }, [brandId, isAllBrands])

  const handleBrandClick = (id: string | undefined) => {
    if (id) {
      navigate(`/brand/${id}`)
    } else {
      navigate('/brand/all')
    }
  }

  const handleCarClick = (car: CarListItem) => {
    navigate(`/car/${car.id}`)
  }

  const handleAllBrandsClick = () => {
    navigate('/brand/all')
  }

  return (
    <div className="space-y-8" data-testid="brand-page">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </button>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-fg)]">
          {isAllBrands ? 'All Vehicles' : currentBrand?.name || 'Loading...'}
        </h1>
        {currentBrand?.description && (
          <p className="mt-2 text-[var(--color-muted)]">
            {currentBrand.description}
          </p>
        )}
      </div>

      {/* Brand Filter */}
      <section>
        <h2 className="text-sm font-medium text-[var(--color-muted)] mb-3">
          Filter by Brand
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAllBrandsClick}
            className={`rounded-[var(--radius-md)] border px-4 py-2 font-medium transition-all ${
              isAllBrands
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:border-[var(--color-border-hover)]'
            }`}
          >
            All Brands
          </button>
          {!isLoadingBrands && (
            <BrandList
              brands={brands}
              selectedBrandId={isAllBrands ? undefined : brandId}
              onBrandClick={handleBrandClick}
            />
          )}
        </div>
      </section>

      {/* Car Grid */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
          {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} available
        </h2>
        <CarGrid
          cars={cars}
          isLoading={isLoadingCars}
          onCarClick={handleCarClick}
          emptyTitle={`No ${currentBrand?.name || ''} cars available`}
          emptyDescription="Check back soon for new listings."
        />
      </section>
    </div>
  )
}
