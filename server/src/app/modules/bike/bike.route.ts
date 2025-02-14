import { Router } from 'express'

import { validateRequest } from '../../middlewares/validate.middleware'

import { bikeController } from './bike.controller'
import { bikeSchema, bikeUpdateSchema } from './bike.schema'

const router = Router()

router.post(
  '/',
  validateRequest(bikeSchema, 'Bike Validation Error'),
  bikeController.createBike
)
router.get('/', bikeController.getAllBikes)
router.get('/:productId', bikeController.getBikeById)
router.put(
  '/:productId',
  validateRequest(bikeUpdateSchema, 'Bike Validation Error'),
  bikeController.updateBike
)
router.delete('/:productId', bikeController.deleteBike)

export const bikeRoutes = router
