import { Router } from 'express'

import validateRequest from '../../middlewares/validateRequest'

import { bikeController } from './bike.controller'
import { bikeSchema, bikeUpdateSchema } from './bike.schema'

const router = Router()

router.post('/', validateRequest(bikeSchema), bikeController.createBike)
router.get('/', bikeController.getAllBikes)
router.get('/:id', bikeController.getBikeById)
router.put('/:id', validateRequest(bikeUpdateSchema), bikeController.updateBike)
router.delete('/:id', bikeController.deleteBike)

export const bikeRoutes = router
