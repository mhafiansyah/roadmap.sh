import { authLogin, authRegister } from '@/controller/auth.controller.js';
import { validateRequest } from '@/middleware/validation.middleware.js';
import {
  userLoginSchema,
  userRegisterSchema,
} from '@/schema/auth.validation.js';
import { Router } from 'express';

const router = Router();

router.post('/register', validateRequest(userRegisterSchema), authRegister);
router.post('/login', validateRequest(userLoginSchema), authLogin);

export default router;
