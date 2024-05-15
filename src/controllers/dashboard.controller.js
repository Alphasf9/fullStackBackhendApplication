import mongoose from "mongoose";
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
    const videoTotalStats = await Video.aggregate([
        {
            $match: {
                owner: req.user?._id
            }
        },

        {
            $lookup: {
                from: "Video",
                localField: "_id",
                foreignField: "views",
                as: "totalViews"
            }
        },


        {
            $lookup: {
                from: "Video",
                localField: "_id",
                foreignField: "videoFile",
                as: "totalVideos"
            }
        },

        {
            $addFields: {
                totalViews: {
                    $size: "totalViews"
                },

                totalVideos: {
                    $size: "totalVideos"
                }
            }
        },

        {
            views: 1
        }
    ])

    if (videoTotalViews.length === 0) {
        throw new ApiError(404, "Video not found or you don't have access to it")
    }


    const totalLikes = await Like.aggregate([
        {
            $match: {
                likedBy: req.user?._id
            }
        },

        {
            $lookup: {
                from: "Like",
                localField: "_id",
                foreignField: "likedBy",
                as: "totalLikes"
            }
        },

        {
            $addFields: {
                totalLikes: {
                    $size: "totalLikes"
                }
            }
        },

        {
            $project: {
                likedBy: 1
            }
        },
    ])


    return res
        .status(200)
        .json(
            200,
            new ApiResponse(
                200,
                {
                    videoTotalStats,
                    totalLikes
                },
                "Total channel stats fetched from server successfully"
            )
        )
})



const getChannelVideos = asyncHandler(async (req, res) => {

    const totalVideos = await Video.aggregate([
        {
            $match: {
                owner: req.user?._id
            }
        }
    ])

    return res
        .status(200)
        .json(
            200,
            totalVideos,
            "Total Videos uploaded by the channel owner fetched from the server successfully"
        )
})


export {
    videoTotalStats,
    getChannelVideos
}