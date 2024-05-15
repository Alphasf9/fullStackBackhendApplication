import mongoose, { isValidObjectId } from 'mongoose';
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    const sortByMap = new Map([
        ["views", "views"],
        ["title", "title"],
        ["description", "description"],
    ])


    let pipeline = [];

    if (query) {
        pipeline.push({
            $match: {
                owner: userId,
                $text: { $search: query }
            },
        })
    }

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid userId");
    }


    const sortingVideo = Video.aggregate([
        {
            $match: { owner: userId }
        },


        {
            $sort: {
                [sortByMap.get(sortBy, sortType)]: 1,
            }
        },

        {
            $skip: (page - 1) * limit,
            default: "$views"
        },

        {
            $limit: parseInt(limit)
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, sortingVideo, "Videos fetched successfully"
            )
        )
});

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!(title && description)) {
        throw new ApiError(401, "Invalid title or description");
    }

    const videoLocalPath = req.file.videoFile[0]?.path;
    const thumbnailPath = req.file.videoFile[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(401, "Please provide a video for the requested video file");
    }

    if (!thumbnailPath) {
        throw new ApiError(401, "Please provide a thumbnail for the requested video file");
    }

    const video = uploadOnCloudinary(videoLocalPath);
    const thumbnail = uploadOnCloudinary(thumbnailPath);

    if (!video) {
        throw new ApiError(401, "Video path not found");
    }

    if (!thumbnail) {
        throw new ApiError(401, "thumbnail path not found");
    }

    const createVideo = Video.create({
        title,
        description,
        videoFile: {
            URL: videoFile.URL,
            publicId: videoFile.publicId
        },

        thumbnail: {
            URL: thumbnailPath.URL,
            publicId: thumbnailPath.publicId
        },

        owner: req.user?._id,
        isPublished: true
    })

    const saveVideo = await createVideo.save()

    const videoSave = await Video.findById(saveVideo._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, videoSave, "Video uploaded successfully"
            )
        )
})



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const validId = isValidObjectId(videoId);

    if (!validId) {
        throw new ApiError(404, "Invalid videoId")
    }
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnail, videoFile } = req.body;

    const newVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail,
                videoFile
            }
        },

        { new: true }
    )


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newVideo,
                "Video updated successfully"
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const userDeletedVideo = await Video.findByIdAndDelete(videoId);

    if (!userDeletedVideo) {
        throw new ApiError(401, "Video cannot be deleted as ,given Videoid does not exist")
    }


    return res.
        status(200)
        .json(
            new ApiResponse(
                200,
                userDeletedVideo,
                "Video deleted successfully"
            )
        )
})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const validId = isValidObjectId(videoId);

    if (!validId) {
        throw new ApiError(404, "Inavailable videoId")
    }


    try {
        Video.findByIdAndUpdate(
            validId,
            {
                $set: {
                    isPublished: true
                }
            },

            { new: true }

        )
    } catch (error) {
        throw new ApiError(404, "Invalid videoId")
    }

})


export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
