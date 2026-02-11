/**
 * Cars API Service
 *
 * API methods for interacting with the vintage car marketplace backend.
 *
 * Usage:
 *   import { carsApi } from '@/services/carsApi'
 *   const brands = await carsApi.getBrands()
 *   const cars = await carsApi.getCars({ brandId: 'uuid' })
 */

import { api, PaginatedResponse } from './api'
import type { Brand, Car, CarListItem, InquiryForm, InquiryCreateResponse, CarFilters } from '@/types/cars'

export const carsApi = {
  /**
   * Get all available car brands
   */
  getBrands: async (): Promise<Brand[]> => {
    const response = await api.get<Brand[]>('/api/cars/brands/')
    return response.data
  },

  /**
   * Get a single brand by ID
   */
  getBrand: async (id: string): Promise<Brand> => {
    const response = await api.get<Brand>(`/api/cars/brands/${id}/`)
    return response.data
  },

  /**
   * Get all cars, optionally filtered by brand or featured status
   */
  getCars: async (filters?: CarFilters): Promise<CarListItem[]> => {
    const params: Record<string, string> = {}
    if (filters?.brand) {
      params.brand = filters.brand
    }
    if (filters?.featured !== undefined) {
      params.featured = filters.featured ? 'true' : 'false'
    }
    const response = await api.get<PaginatedResponse<CarListItem>>('/api/cars/', { params })
    return response.data.results
  },

  /**
   * Get a single car by ID with full details
   */
  getCar: async (id: string): Promise<Car> => {
    const response = await api.get<Car>(`/api/cars/${id}/`)
    return response.data
  },

  /**
   * Submit an inquiry for a car
   */
  submitInquiry: async (data: InquiryForm): Promise<InquiryCreateResponse> => {
    const response = await api.post<InquiryCreateResponse>('/api/cars/inquiries/', data)
    return response.data
  },
}

// Mock data for development when backend is not available
export const mockBrands: Brand[] = [
  { id: '1', name: 'Ferrari', logo_url: '', description: 'Italian luxury sports car manufacturer', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Porsche', logo_url: '', description: 'German automobile manufacturer specializing in high-performance sports cars', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Jaguar', logo_url: '', description: 'British luxury vehicle company', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Mercedes-Benz', logo_url: '', description: 'German luxury and commercial vehicle automotive brand', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Aston Martin', logo_url: '', description: 'British independent manufacturer of luxury sports cars and grand tourers', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
]

export const mockCars: CarListItem[] = [
  {
    id: '1',
    brand: mockBrands[0],
    model: '250 GTO',
    year: 1962,
    price: '48000000.00',
    is_featured: true,
    status: 'active',
    primary_image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    brand: mockBrands[1],
    model: '911 Carrera RS 2.7',
    year: 1973,
    price: '1200000.00',
    is_featured: true,
    status: 'active',
    primary_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    created_at: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    brand: mockBrands[2],
    model: 'E-Type',
    year: 1961,
    price: '280000.00',
    is_featured: true,
    status: 'active',
    primary_image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    created_at: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    brand: mockBrands[3],
    model: '300SL Gullwing',
    year: 1955,
    price: '1500000.00',
    is_featured: false,
    status: 'active',
    primary_image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '5',
    brand: mockBrands[4],
    model: 'DB5',
    year: 1964,
    price: '900000.00',
    is_featured: false,
    status: 'active',
    primary_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    created_at: '2024-01-19T10:00:00Z',
  },
  {
    id: '6',
    brand: mockBrands[0],
    model: 'Testarossa',
    year: 1984,
    price: '250000.00',
    is_featured: false,
    status: 'active',
    primary_image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800',
    created_at: '2024-01-20T10:00:00Z',
  },
]

export const mockCarDetails: Record<string, Car> = {
  '1': {
    id: '1',
    brand: mockBrands[0],
    model: '250 GTO',
    year: 1962,
    price: '48000000.00',
    description: 'The Ferrari 250 GTO is a GT car produced by Ferrari from 1962 to 1964 for homologation into the FIA\'s Group 3 Grand Touring Car category. It is widely considered to be the greatest Ferrari ever made.',
    is_featured: true,
    status: 'active',
    images: [
      { id: '1', image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', alt_text: 'Ferrari 250 GTO front view', is_primary: true, sort_order: 0 },
      { id: '2', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', alt_text: 'Ferrari 250 GTO side view', is_primary: false, sort_order: 1 },
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  '2': {
    id: '2',
    brand: mockBrands[1],
    model: '911 Carrera RS 2.7',
    year: 1973,
    price: '1200000.00',
    description: 'The Porsche 911 Carrera RS 2.7 was a lightweight version of the 911 built for homologation into the Group 4 Special GT racing class.',
    is_featured: true,
    status: 'active',
    images: [
      { id: '3', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', alt_text: 'Porsche 911 Carrera RS', is_primary: true, sort_order: 0 },
    ],
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  '3': {
    id: '3',
    brand: mockBrands[2],
    model: 'E-Type',
    year: 1961,
    price: '280000.00',
    description: 'The Jaguar E-Type, or the Jaguar XK-E, is a British sports car that was manufactured by Jaguar Cars Ltd. Enzo Ferrari called it "the most beautiful car ever made".',
    is_featured: true,
    status: 'active',
    images: [
      { id: '4', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', alt_text: 'Jaguar E-Type', is_primary: true, sort_order: 0 },
    ],
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
  },
}

/**
 * Mock API for development when backend is not available
 */
export const mockCarsApi = {
  getBrands: async (): Promise<Brand[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockBrands
  },

  getBrand: async (id: string): Promise<Brand> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const brand = mockBrands.find(b => b.id === id)
    if (!brand) throw new Error('Brand not found')
    return brand
  },

  getCars: async (filters?: CarFilters): Promise<CarListItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    let cars = [...mockCars]
    if (filters?.brand) {
      cars = cars.filter(c => c.brand.id === filters.brand)
    }
    if (filters?.featured) {
      cars = cars.filter(c => c.is_featured)
    }
    return cars
  },

  getCar: async (id: string): Promise<Car> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const car = mockCarDetails[id]
    if (!car) {
      // Generate a basic car from list item if detail not available
      const listItem = mockCars.find(c => c.id === id)
      if (!listItem) throw new Error('Car not found')
      return {
        ...listItem,
        description: 'A beautiful vintage car.',
        images: listItem.primary_image ? [{ id: '1', image_url: listItem.primary_image, alt_text: `${listItem.brand.name} ${listItem.model}`, is_primary: true, sort_order: 0 }] : [],
        updated_at: listItem.created_at,
      }
    }
    return car
  },

  submitInquiry: async (data: InquiryForm): Promise<InquiryCreateResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      message: 'Inquiry submitted successfully',
      data: {
        id: crypto.randomUUID(),
        car: data.car,
        collector_name: data.collector_name,
        collector_email: data.collector_email,
        collector_phone: data.collector_phone || '',
        message: data.message,
        created_at: new Date().toISOString(),
      },
    }
  },
}

// Use mock API since backend may not be available during development
export const useMockApi = true
export const activeApi = useMockApi ? mockCarsApi : carsApi
