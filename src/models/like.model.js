import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        video: {
            type: mongoose.Types.ObjectId,
            ref: "Video"
        },

        comment: {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        },

        tweet: {
            type: mongoose.Types.ObjectId,
            ref: "Tweet"
        },

        likedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            index: true
        }
    },

    { timestamps: true });




export const Like = mongoose.model("Like", likeSchema);