import { Router } from "express";
import auth from "./auth.js";
import users from "./users.js";
import rooms from "./rooms.js";
import room_collaborators from "./room_collaborators.js";
import images from "./images.js";
import object3d from "./object3d.js";
import textures from "./textures.js";
import collections from "./collections.js";
import collection_items from "./collection_items.js";
import magazines from "./magazines.js";
import magazine_items from "./magazine_items.js";

const r = Router();

r.use("/", auth);
r.use("/user", users);
r.use("/room", rooms);
r.use("/room-collaborator", room_collaborators);
r.use("/media", images);
r.use("/object3d", object3d);
r.use("/texture", textures);
r.use("/collection", collections);
r.use("/collection-item", collection_items);
r.use("/magazine", magazines);
r.use("/magazine-item", magazine_items);

export default r;
