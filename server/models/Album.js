import { model, Schema } from "mongoose";

const albumSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        owner: {
            type: Schema.Types.ObjectId, ref: "User", required: true, index: true
        },
        photos:[{
            type:Schema.Types.ObjectId, ref: "Media"
        }]

    }, { timestamps: true }
)



export const Album = model("Album", albumSchema);