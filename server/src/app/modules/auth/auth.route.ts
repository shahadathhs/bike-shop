import { Router } from 'express'

import { UserRole } from '../../enum/role'
import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'

import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'

const router = Router()

router.post(
  '/register',
  validateRequest(AuthValidation.registerUserZodSchema),
  AuthController.registerUser
)

router.post('/login', validateRequest(AuthValidation.loginUserZodSchema), AuthController.loginUser)

router.post('/deactivate/:id', Authentication(UserRole.ADMIN), AuthController.deactivateUser)

router.patch(
  '/update-profile',
  Authentication(UserRole.CUSTOMER),
  validateRequest(AuthValidation.updateProfileZodSchema),
  AuthController.updateProfile
)

router.patch('/update-password', Authentication(UserRole.CUSTOMER), AuthController.updatePassword)

router.get('/getAll', Authentication(UserRole.ADMIN), AuthController.getAllUsers)

export const AuthRoutes = router
