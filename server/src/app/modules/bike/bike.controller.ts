import { NextFunction, Request, Response } from 'express'

import errorResponse from '../../res/error.res'
import successResponse from '../../res/success.res'

import { bikeServices } from './bike.services'

const createBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bikeServices.createBikeService(req.body)
    successResponse(res, result, 'Bike created successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to create bike.')
    next(error)
  }
}

const getAllBikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = req.query.searchTerm as string
    const result = await bikeServices.getAllBikesService(searchTerm)
    if (result.length === 0) {
      errorResponse(res, new Error('No bikes found.'), 'Bikes not found.', 404)
      return
    }
    successResponse(res, result, 'Bikes retrieved successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to retrieve bikes.')
    next(error)
  }
}

const getBikeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bikeServices.getBikeByIdService(req.params.id)
    if (!result) {
      errorResponse(res, new Error('Bike not found.'), 'Bike not found.', 404)
      return
    }
    successResponse(res, result, 'Bike retrieved successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to retrieve bike.')
    next(error)
  }
}

const updateBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const payload = req.body

    // * Validate bike existence
    const bike = await bikeServices.getBikeByIdService(id)
    if (!bike) {
      errorResponse(res, new Error('Bike not found.'), 'Bike not found.', 404)
      return
    }

    // * Handle case where payload is empty
    if (Object.keys(payload).length === 0) {
      errorResponse(res, new Error('No fields to update.'), 'No fields to update.', 400)
      return
    }

    // * Update bike if payload is valid
    const updatedBike = await bikeServices.updateBikeService(id, payload)

    if (!updatedBike) {
      errorResponse(res, new Error('Failed to update bike.'), 'Failed to update bike.', 500)
      return
    }

    successResponse(res, updatedBike, 'Bike updated successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to update bike.')
    next(error)
  }
}

const deleteBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // * Validate bike existence
    const bike = await bikeServices.getBikeByIdService(id)
    if (!bike) {
      errorResponse(res, new Error('Bike not found.'), 'Bike not found.', 404)
      return
    }

    // * Delete bike
    const deletedBike = await bikeServices.deleteBikeService(id)
    if (!deletedBike) {
      errorResponse(res, new Error('Failed to delete bike.'), 'Failed to delete bike.', 500)
      return
    }

    successResponse(res, {}, 'Bike deleted successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to delete bike.')
    next(error)
  }
}

export const bikeController = {
  createBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike
}
