import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'
import { validateObjectId } from '../../helpers/validateObjectId'

import { IBike } from './bike.interface'
import { Bike } from './bike.model'

const createBikeService = async (payload: IBike): Promise<IBike> => {
  const result = await Bike.create(payload)
  return result
}

const getAllBikesService = async (searchTerm?: string): Promise<IBike[]> => {
  if (searchTerm) {
    const result = await Bike.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    return result
  }
  const result = await Bike.find({})
  return result
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
