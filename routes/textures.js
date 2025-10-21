// routes/textures.js
import { Router } from 'express';
import * as c from '../controllers/textures.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);

r.get('/', c.list);
r.post('/', c.uploadTextures, c.create);    // <= nhận file
r.patch('/:id', c.uploadTextures, c.update); // <= nhận file khi update
r.delete('/:id', c.remove);

export default r;
