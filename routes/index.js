import { Router } from 'express';
import auth from './auth.js';
import users from './users.js';
import rooms from './rooms.js';
import room_collaborators from './room_collaborators.js';
import images from './images.js';
import object3d from './object3d.js';
import textures from './textures.js';
import collections from './collections.js';
import collection_items from './collection_items.js';
import magazines from './magazines.js';
import magazine_items from './magazine_items.js';

const r = Router();

r.use('/auth', auth);
r.use('/users', users);
r.use('/rooms', rooms);
r.use('/room-collaborators', room_collaborators);
r.use('/images', images);
r.use('/object3d', object3d);
r.use('/textures', textures);
r.use('/collections', collections);
r.use('/collection-items', collection_items);
r.use('/magazines', magazines);
r.use('/magazine-items', magazine_items);

export default r;
