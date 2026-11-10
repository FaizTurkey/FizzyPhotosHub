import { model, Schema } from "mongoose";

const mediaSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            default: ""
        },
        fileId: {
            type: String,
            default: ""
        },
        size: {
            type: Number,
            default: 0
        },
        format: {
            type: String,
            default: "jpg"
        },
        mediaType: {
            type: String,
            default: "image", enum: ["image", "video"], index: true
        },
        duration: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        },
        owner: {
            type: Schema.Types.ObjectId, ref: "User", required: true, index: true
        },
        isFavorite: {
            type: Boolean,
            default: false,
            index: true
        },
        isTrash: {
            type: Boolean,
            default: false,
            index: true
        },
        trashAt: {
            type: Date,
            default: null
        },
        objects: {
            type: [String],
            default: []
        }


    }, { timestamps: true }
)

mediaSchema.index({ objects: 1 });

export const Media = model("Media", mediaSchema);