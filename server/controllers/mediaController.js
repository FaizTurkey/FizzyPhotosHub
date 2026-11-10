
import { imageKit, toFile } from '../config/imageKit.js'
import { Album } from '../models/Album.js';
import { Media } from '../models/Media.js';


export const uploadMedia = async (req, res) => {

    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ message: "No files uploaded" });
            return;
        }

        const uploadedMedia = [];
        for (const file of files) {
            const isVideo = file.mimetype.startsWith("video/");
            const mediaType = isVideo ? "video" : "image";
            const fileObj = await toFile(file.buffer, file.originalname, { type: file.mimetype });

            const uploadParams = {
                file: fileObj,
                fileName: `${Date.now()}-${file.originalname}`,
                folder: isVideo ? "/my-videos" : "/my-photos",
                useUniqueFileName: true,
                responseFields: ['tags'],
            }

            if (!isVideo) {
                uploadParams.extensions = [
                    {
                        name: "google-auto-tagging",
                        minConfidence: 60,
                        maxTags: 10,
                    }
                ]
            }


            const ikRes = await imageKit.files.upload(uploadParams);

            const title = file.originalname;
            const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;
            const imagePath = ikRes.filePath;
            const transformation = "tr:w-400";
            const thumbnailUrl = isVideo ? `${endpoint}/${transformation}/${imagePath}/ik-thumbnail.jpg` : `${endpoint}/${transformation}/${imagePath}`;

            const detectedObjects = [];
            if (ikRes.AITags && Array.isArray(ikRes.AITags)) {
                ikRes.AITags.forEach((tag) => {
                    if (tag.name && typeof tag.name === "string") {
                        detectedObjects.push(tag.name.toLocaleLowerCase().trim())
                    }
                })
            }

            const item = await Media.create({
                title: title || (isVideo ? "Untitled Video" : "Untitled Photo"),
                url: ikRes.url,
                thumbnailUrl,
                fileId: ikRes.fileId,
                size: ikRes.size || file.size,
                format: ikRes.fileType || (isVideo ? "mp4" : "jpg"),
                mediaType,
                duration: ikRes.duration || 0,
                width: ikRes.width || 1200,
                height: ikRes.height || 800,
                owner: req.user?.id,
                objects: detectedObjects,
            });

            uploadedMedia.push(item);
        }

        res.status(201).json({
            message: `Successfully uploaded ${uploadedMedia.length} item(s)`,
            media: uploadedMedia
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Upload failed" });

    }

}


export const getMedia = async (req, res) => {
    try {
        const { favorite, q, type } = req.query;
        const filter = { owner: req.user?.id, isTrash: false };

        if (favorite === "true") {
            filter.isFavorite = true;
        }

        if ((type === "video" || type === "image")) {
            filter.mediaType = type;
        }

        if (q && typeof q === "string" && q.trim()) {
            const searchTerm = q.trim();
            filter.$or = [{ title: { $regex: searchTerm, $options: "i" } }, {
                objects: { $regex: searchTerm, $options: "i" }
            }];
        }

        const media = await Media.find(filter).sort({ createdAt: -1 })
        res.json({ media })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to fetch media" });
    }

}

export const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Media.findOne({ _id: id, owner: req.user?.id })
        if (!item) {
            res.status(404).json({ message: "Media not found" });
            return;
        }

        item.isFavorite = !item.isFavorite;
        await item.save();
        res.json({ media: item });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to update favorite status." });

    }

}

export const toggleTrash = async (req, res) => {
    try {

        const { id } = req.params;
        const { restore } = req.body;
        const item = await Media.findOne({ _id: id, owner: req.user?.id })
        if (!item) {
            res.status(404).json({ message: "Media not found" });
            return;
        }

        item.isTrash = !restore;
        item.trashAt = restore ? null : new Date();
        await item.save();

        res.json({
            message: restore ? "Restored from trash" : "Moved to trash",
            media: item
        })



    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to update trash status." });

    }

}


export const getTrash = async (req, res) => {
    try {
        const media = await Media.find({
            owner: req.user?.id,
            isTrash: true,
        }).sort({ trashAt: -1 })

        res.json({ media });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to fetch trash." });
    }

}

export const deleteMediaPermanent = async (req, res) => {

    try {
        const { id } = req.params;
        const item = await Media.findOne({ _id: id, owner: req.user?.id, isTrash: true })
        if (!item) {
            res.status(404).json({ message: "Media not found" });

            return;
        }

        if (item.fileId) {
            try {
                await imageKit.files.delete(item.fileId);
            } catch (err) {
                console.warn("[ImageKit] File deletion failed :", err?.message);

            }
        }

        // Remove media form any album
        await Album.updateMany({ photos: item._id }, { $pull: { photos: item._id } });
        await item.deleteOne();
        res.json({ message: "Media permanently deleted" });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to delete media." });
    }
}


export const emptyTrash = async (req, res) => {
    try {
        const trashedMedia = await Media.find({ owner: req.user?.id, isTrash: true })
        for (const item of trashedMedia) {
            try {
                await imageKit.files.delete(item.fileId);
            } catch (err) {
                console.warn("[ImageKit] File deletion failed :", err?.message);
            }
            await Album.updateMany({ photos: item._id }, { $pull: { photos: item._id } });
            await item.deleteOne();

        }

        res.json({ message: `Emptied trash (${trashedMedia.length} items removed)` });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to empty trash." });
    }

}

export const getStorageStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const activeMedia = await Media.find({ owner: userId, isTrash: false })
        const favoriteCount = activeMedia.filter((p) => p.isFavorite).length;
        const totalBytes = activeMedia.reduce((sum, p) => sum + (p.size || 0), 0);

        const albumCount = await Album.countDocuments({ owner: userId });

        const videoCount = activeMedia.filter((p) => p.mediaType === "video").length;
        const imageCount = activeMedia.length - videoCount;

        res.json({
            mediaCount: activeMedia.length,
            imageCount,
            videoCount,
            favoriteCount,
            totalBytes,
            albumCount

        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to get stats." });
    }

}