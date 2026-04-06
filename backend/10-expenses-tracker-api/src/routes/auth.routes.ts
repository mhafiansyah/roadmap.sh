import { Router } from 'express';
import * as c from '@/controller/auth.controller.js';

export const router = Router();

router.post('/login', c.authLogin);
router.post('/register', c.authRegister);
router.post('/refresh', c.authRefresh);

export default router;
