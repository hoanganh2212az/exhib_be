import { Router } from 'express';
import * as c from '../controllers/authController.js';

const r = Router();

r.post('/signup', c.signup);
r.post('/login', c.login);
r.post('/refresh', c.refresh);
r.post('/logout', c.logout);

export default r;
