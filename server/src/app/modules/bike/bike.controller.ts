import { NextFunction, Request, Response } from 'express'

import errorResponse from '../../res/error.res'
import successResponse from '../../res/success.res'

import { bikeServices } from './bike.services'

/**
 * Handles the creation of a new bike.
 *
 * Receives HTTP POST requests with bike details in the request body,
 * passes them to the createBikeService for processing and persists
 * the new bike in the database.
 *
 * On success, sends a success response with the created bike details.
 * On failure, sends an error response detailing the failure reason.
 *
 * @param req - The HTTP request object containing bike data in its body.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
const createBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bikeServices.createBikeService(req.body)
    successResponse(res, result, 'Bike created successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to create bike.')
    next(error)
  }
}

/**
 * Handles GET requests for retrieving all bikes, with optional search functionality.
 *
 * Accepts an optional search term as a query parameter to filter bikes by name,
 * brand, or category, with case-insensitive search. Passes the search term to
 * getAllBikesService for fetching bikes.
 *
 * On success, sends a success response with the list of retrieved bikes.
 * If no bikes are found, sends a 404 error response.
 * On failure, sends an error response detailing the failure reason.
 *
 * @param req - The HTTP request object containing an optional searchTerm in its query.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
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

/**
 * Handles GET requests for retrieving a single bike by its ID.
 *
 * Receives the bike ID as a route parameter (productId) and
 * passes it to the getBikeByIdService for processing.
 *
 * On success, sends a success response with the retrieved bike details.
 * On failure, sends an error response detailing the failure reason.
 * If the bike is not found, sends a 404 error response.
 *
 * @param req - The HTTP request object containing the bike ID in its params.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
const getBikeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bikeServices.getBikeByIdService(req.params.productId)
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

/**
 * Handles PUT requests for updating a single bike by its ID.
 *
 * Receives the bike ID as a route parameter (productId) and
 * the fields to be updated as a JSON payload in the request body.
 * Passes the bike ID and payload to the updateBikeService for processing.
 *
 * On success, sends a success response with the updated bike details.
 * On failure, sends an error response detailing the failure reason.
 * If the bike is not found, sends a 404 error response.
 * If the payload is empty, sends a 400 error response.
 *
 * @param req - The HTTP request object containing the bike ID in its params and the update fields in its body.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
const updateBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params
    const payload = req.body

    // * Validate bike existence
    const bike = await bikeServices.getBikeByIdService(productId)
    if (!bike) {
      errorResponse(res, new Error('Bike not found.'), 'Bike not found.', 404)
      return
    }

    // * Handle case where payload is empty
    if (Object.keys(payload).length === 0) {
      errorResponse(
        res,
        new Error('No fields to update.'),
        'No fields to update.',
        400
      )
      return
    }

    // * Update bike if payload is valid
    const updatedBike = await bikeServices.updateBikeService(productId, payload)

    if (!updatedBike) {
      errorResponse(
        res,
        new Error('Failed to update bike.'),
        'Failed to update bike.',
        500
      )
      return
    }

    successResponse(res, updatedBike, 'Bike updated successfully.')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to update bike.')
    next(error)
  }
}

/**
 * Handles DELETE requests for deleting a single bike by its ID.
 *
 * Receives the bike ID as a route parameter (productId) and
 * passes it to the deleteBikeService for processing.
 *
 * On success, sends a success response with the deleted bike details.
 * On failure, sends an error response detailing the failure reason.
 * If the bike is not found, sends a 404 error response.
 *
 * @param req - The HTTP request object containing the bike ID in its params.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
const deleteBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params

    // * Validate bike existence
    const bike = await bikeServices.getBikeByIdService(productId)
    if (!bike) {
      errorResponse(res, new Error('Bike not found.'), 'Bike not found.', 404)
      return
    }

    // * Delete bike
    const deletedBike = await bikeServices.deleteBikeService(productId)
    if (!deletedBike) {
      errorResponse(
        res,
        new Error('Failed to delete bike.'),
        'Failed to delete bike.',
        500
      )
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
