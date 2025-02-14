export const bikeCategoryEnum = ['Mountain', 'Road', 'Hybrid', 'Electric'] as const
export const bikeModelEnum = ['Sport', 'Cruiser', 'Touring', 'Standard'] as const
export const bikeBrandEnum = ['Trek', 'Giant', 'Specialized', 'Cannondale', 'Scott'] as const

// * Infer the types from enums using typeof and array indexing
export type TBikeCategory = (typeof bikeCategoryEnum)[number]
export type TBikeModel = (typeof bikeModelEnum)[number]
export type TBikeBrand = (typeof bikeBrandEnum)[number]

// * Query Options for getting bikes
export interface IBikeQueryOptions {
  searchTerm?: string
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  model?: TBikeModel
  category?: TBikeCategory
  brand?: TBikeBrand
}
