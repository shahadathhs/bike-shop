export const bikeCategoryEnum = ['Mountain', 'Road', 'Hybrid', 'Electric'] as const
export const bikeModelEnum = ['Sport', 'Cruiser', 'Touring', 'Standard'] as const

// Infer the types from enums using typeof and array indexing
export type TBikeCategory = (typeof bikeCategoryEnum)[number]
export type TBikeModel = (typeof bikeModelEnum)[number]
