/**
 * CarDetailPage Component
 *
 * Displays full car details with inquiry form.
 *
 * Usage:
 *   <CarDetailPage />
 */

import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CarDetail } from '@/components/CarDetail'
import { LoadingSpinner, EmptyState } from '@/components/ui'
import { activeApi } from '@/services/carsApi'
import { AlertCircle } from 'lucide-react'
import type { Car } from '@/types/cars'

export function CarDetailPage() {
  const { carId } = useParams<{ carId: string }>()
  const navigate = useNavigate()
  const [car, setCar] = React.useState<Car | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setError('Invalid car ID')
        setIsLoading(false)
        return
      }

      try {
        const data = await activeApi.getCar(carId)
        setCar(data)
      } catch (err) {
        setError('Car not found')
        console.error('Failed to fetch car:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCar()
  }, [carId])

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20" data-testid="car-detail-loading">
        <LoadingSpinner size="xl" label="Loading car details..." />
      </div>
    )
  }

  if (error || !car) {
    return (
      <EmptyState
        icon={<AlertCircle />}
        title="Car Not Found"
        description={error || 'The car you are looking for does not exist.'}
        action={
          <button
            onClick={() => navigate('/')}
            className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Back to Home
          </button>
        }
        data-testid="car-detail-error"
      />
    )
  }

  return <CarDetail car={car} onBack={handleBack} />
}
