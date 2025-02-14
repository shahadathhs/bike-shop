import { NextFunction, Request, Response } from 'express'

import { httpStatusCode } from '../../enum/statusCode'
import sendError from '../../errorHandling/sendError'
import simplifyError from '../../errorHandling/simplifyError'
import sendResponse from '../../utils/sendResponse'

import { BikeServices } from './bike.services'

const createBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BikeServices.createBikeService(req.body)
    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Bike created successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const getAllBikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BikeServices.getAllBikesService(req.query.searchTerm as string)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Bikes retrieved successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const getBikeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await BikeServices.getBikeByIdService(id)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Bike retrieved successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const updateBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await BikeServices.updateBikeService(id, req.body)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Bike updated successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const deleteBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await BikeServices.deleteBikeService(id)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Bike deleted successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const restockBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const result = await BikeServices.restockBikeService(id, quantity)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User deactivated successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

export const bikeController = {
  createBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  restockBike
}
