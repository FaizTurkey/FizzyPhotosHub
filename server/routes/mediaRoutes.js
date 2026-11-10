import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { deleteMediaPermanent, emptyTrash, getMedia, getStorageStats, getTrash, toggleFavorite, toggleTrash, uploadMedia } from "../controllers/mediaController.js";


const mediaRouter = Router();

mediaRouter.use(requireAuth);

mediaRouter.post("/upload",upload.array("media",20), uploadMedia);
mediaRouter.get("/", getMedia);
mediaRouter.get("/trash", getTrash);
mediaRouter.delete("/trash/empty", emptyTrash);
mediaRouter.get("/stats", getStorageStats);
mediaRouter.patch("/:id/favorite", toggleFavorite);
mediaRouter.patch("/:id/trash", toggleTrash);
mediaRouter.delete("/:id", deleteMediaPermanent);


export default mediaRouter;