import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'
import { validateObjectId } from '../../helpers/validateObjectId'
import { QueryBuilder } from '../../queryBuilder/queryBuilder'

import { IBikeQueryOptions } from './bike.helper'
import { IBike } from './bike.interface'
import { Bike } from './bike.model'

const createBikeService = async (payload: IBike): Promise<IBike> => {
  const result = await Bike.create(payload)
  return result
}

const getAllBikesService = async (queryOptions: IBikeQueryOptions = {}): Promise<IBike[]> => {
  // * Step 1: Build the initial query.
  const query = Bike.find()

  // * Step 2: Apply query options to the query builder.
  const queryBuilder = new QueryBuilder<IBike>(query, queryOptions)

  // * Step 3: Apply range filters for price.
  const rangeFilters = []
  if (queryOptions.minPrice !== undefined || queryOptions.maxPrice !== undefined) {
    rangeFilters.push({
      fieldName: 'price',
      min: Number(queryOptions.minPrice),
      max: Number(queryOptions.maxPrice)
    })
  }
  // Initialize the range filters if they are provided
  if (rangeFilters.length > 0) {
    queryBuilder.filterByRange(rangeFilters)
  }

  // * Step 4: Apply field filters for model, category, and brand.
  const fieldFilters = []
  if (queryOptions.model) {
    fieldFilters.push({
      fieldName: 'model',
      searchTerm: queryOptions.model
    })
  }
  if (queryOptions.category) {
    fieldFilters.push({
      fieldName: 'category',
      searchTerm: queryOptions.category
    })
  }
  if (queryOptions.brand) {
    fieldFilters.push({
      fieldName: 'brand',
      searchTerm: queryOptions.brand
    })
  }
  // Initialize the field filters if they are provided
  if (fieldFilters.length > 0) {
    queryBuilder.filterByFields(fieldFilters)
  }

  // * Step 5: Initialize pagination
  queryBuilder.paginate(Number(queryOptions.page), Number(queryOptions.limit))

  // * Execute the final query and return the bikes.
  const bikes = await queryBuilder.query
  return bikes
}

const getBikeByIdService = async (id: string): Promise<IBike | null> => {
  validateObjectId(id)

  const result = await Bike.findById(id)

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Bike not found.')
  }

  return result
}

const updateBikeService = async (id: string, payload: Partial<IBike>): Promise<IBike | null> => {
  validateObjectId(id)

  getBikeByIdService(id)

  const result = await Bike.findOneAndUpdate({ _id: id }, payload, {
    new: true
  })

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Failed to update bike.')
  }

  return result
}

const deleteBikeService = async (id: string): Promise<IBike | null> => {
  validateObjectId(id)

  getBikeByIdService(id)

  const result = await Bike.findByIdAndDelete(id)

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Failed to delete bike.')
  }

  return result
}

const restockBikeService = async (id: string, quantity: number): Promise<IBike | null> => {
  validateObjectId(id)

  getBikeByIdService(id)

  const result = await Bike.findOneAndUpdate(
    { _id: id },
    { quantity },
    {
      new: true
    }
  )

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Failed to restock bike.')
  }
  return result
}

export const BikeServices = {
  createBikeService,
  getAllBikesService,
  getBikeByIdService,
  updateBikeService,
  deleteBikeService,
  restockBikeService
}
