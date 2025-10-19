import { Router } from 'express';
import * as c from '../controllers/rooms.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';

const r = Router();
const upload = multer(); // parse multipart/form-data

r.use(requireAuth);

r.get('/', c.list);

// Cho phép gửi form-data có file field tên "room_json"
r.post('/', upload.single('room_json'), c.create);

// Cho phép update với file "room_json" nếu có
r.patch('/:id', upload.single('room_json'), c.update);

r.delete('/:id', c.remove);

export default r;
