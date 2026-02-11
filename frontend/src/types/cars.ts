/**
 * Car Types
 *
 * TypeScript types for the vintage car marketplace.
 */

export interface Brand {
  id: string
  name: string
  logo_url: string
  description: string
  created_at: string
  updated_at: string
}

export interface CarImage {
  id: string
  image_url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
}

export type CarStatus = 'draft' | 'active' | 'sold' | 'archived'

export interface CarListItem {
  id: string
  brand: Brand
  model: string
  year: number
  price: string
  is_featured: boolean
  status: CarStatus
  primary_image: string | null
  created_at: string
}

export interface Car {
  id: string
  brand: Brand
  model: string
  year: number
  price: string
  description: string
  is_featured: boolean
  status: CarStatus
  images: CarImage[]
  created_at: string
  updated_at: string
}

export interface InquiryForm {
  car: string
  collector_name: string
  collector_email: string
  collector_phone?: string
  message: string
}

export interface InquiryResponse {
  id: string
  car: string
  collector_name: string
  collector_email: string
  collector_phone: string
  message: string
  created_at: string
}

export interface InquiryCreateResponse {
  message: string
  data: InquiryResponse
}

// Filter types
export interface CarFilters {
  brand?: string
  featured?: boolean
}
