import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits :{
        fileSize : 100 * 1024 * 1024, // MAX 100MB
        files: 20 // max 20 files per batch upload
    },
    fileFilter : (_req,file,cb) => {
        if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
            cb(null , true)
        }else{
            cb(new Error("Only image and video files are allowed"));
        }
    }
})