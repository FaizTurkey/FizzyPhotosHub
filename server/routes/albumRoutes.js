import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { addPhotostoAlbum, createAlbum, deleteAlbum, getAlbumById, getMyAlbums, removePhotosFromAlbum } from "../controllers/albumController.js";

const albumRouter = Router();

albumRouter.use(requireAuth);

albumRouter.post("/" , createAlbum);
albumRouter.get("/" , getMyAlbums);
albumRouter.get("/:id" , getAlbumById);
albumRouter.delete("/:id" , deleteAlbum);
albumRouter.post("/:id/photos" , addPhotostoAlbum);
albumRouter.delete("/:id/photos/:photoId" , removePhotosFromAlbum);

export default albumRouter;
