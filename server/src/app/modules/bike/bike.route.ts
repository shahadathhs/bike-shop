import { Router } from 'express'

import { UserRole } from '../../enum/role'
import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'

import { bikeController } from './bike.controller'
import { bikeSchema, bikeUpdateSchema } from './bike.schema'

const router = Router()

router.get('/', bikeController.getAllBikes)
router.get('/:id', bikeController.getBikeById)

router.post(
  '/',
  Authentication(UserRole.ADMIN),
  validateRequest(bikeSchema),
  bikeController.createBike
)
router.put(
  '/:id',
  Authentication(UserRole.ADMIN),
  validateRequest(bikeUpdateSchema),
  bikeController.updateBike
)
router.delete('/:id', Authentication(UserRole.ADMIN), bikeController.deleteBike)
router.patch('/:id/restock', Authentication(UserRole.ADMIN), bikeController.restockBike)

export const bikeRoutes = router
