import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'
import { validateObjectId } from '../../helpers/validateObjectId'

import { IBikeQueryOptions } from './bike.helper'
import { IBike } from './bike.interface'
import { Bike } from './bike.model'

const createBikeService = async (payload: IBike): Promise<IBike> => {
  const result = await Bike.create(payload)
  return result
}

interface IBikeResponse {
  bikes: IBike[]
  metadata: {
    total: number
    page: number
    limit: number
  }
}

export const getAllBikesService = async (
  queryOptions: IBikeQueryOptions = {}
): Promise<IBikeResponse> => {
  // Destructure query options with default values for pagination.
  const {
    searchTerm,
    minPrice,
    maxPrice,
    model,
    category,
    brand,
    page = 1,
    limit = 10
  } = queryOptions

  // Build the filter object based on the provided options.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {}

  if (searchTerm) {
    // Searching in name, brand, or category fields.
    filter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } }
    ]
  }

  // Price range filtering.
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {}
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice)
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice)
  }

  // Exact field filters.
  if (model) filter.modelName = model
  if (category) filter.category = category
  if (brand) filter.brand = brand

  // Calculate pagination variables.
  const currentPage = Number(page)
  const itemsPerPage = Number(limit)
  const skip = (currentPage - 1) * itemsPerPage

  // Get total number of bikes matching the filter.
  const total = await Bike.countDocuments(filter)

  // Retrieve the bikes with the applied filter and pagination.
  const bikes = await Bike.find(filter).skip(skip).limit(itemsPerPage)

  // Return the bikes along with metadata.
  return {
    bikes,
    metadata: {
      total,
      page: currentPage,
      limit: itemsPerPage
    }
  }
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
