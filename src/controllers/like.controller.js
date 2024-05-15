import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { response } from "express"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;


    const validId = mongoose.isValidObjectId(videoId);

    if (!validId) {
        throw new ApiError(401, "Invalid videoId");
    }


    const videoToggleLiking = await Like.findByIdAndUpdate(
        { id: videoId },

        {
            $set: {
                likedBy: {
                    $set: { likedBy: { $ne: "$likedBy" } },
                }
            }
        },

        { new: true }

    )


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoToggleLiking,
                "Video  toggling done successfully"
            )
        )

})



const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const validId = isValidObjectId(commentId);

    if (!validId) {
        throw new ApiError(401, "Invalid comment id provided");
    }

    const togglingCommentLike = Like.findByIdAndUpdate(
        { id: commentId },

        {
            $set: {
                comment: { $ne: "$comment" }
            }
        }
    )


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                togglingCommentLike,
                "Comment toggling done successfully"
            )
        )
})


const togggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const validId = mongoose.isValidObjectId(tweetId);

    if (!validId) {
        throw new ApiError(401, "Invalid Tweet ID provided");
    }

    const togglingTweetLike = await Like.findByIdAndUpdate(
        { id: tweetId },

        {
            $set: {
                tweet: { $ne: "$tweet" }
            }
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                togglingTweetLike,
                "Toggling Tweet done successfully"
            )
        )
})


const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: req.user?._id
            }
        },

        {
            $lookup: {
                from: "video",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
            }
        },

        {
            $project: {
                video: 1
            }
        }
    ])


    return res
        .status(200)
        .json(
            new ApiResponse(
                likedVideos,
                "Liked videos fetched successfully"
            )
        )
})

export {
    toggleVideoLike,
    toggleCommentLike,
    togggleTweetLike,
    getLikedVideos
}

