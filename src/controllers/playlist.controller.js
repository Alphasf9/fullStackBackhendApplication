import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videos } = req.body;


    const videoLocalPath = req.files.videos[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Please provide a video path");
    }

    videos = await uploadOnCloudinary(videoLocalPath);

    if (!videos) {
        throw new ApiError(400, "video file is not available");
    }


    if (
        [name, description, videos].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const existedPlaylist = await Playlist.findOne({
        $or: [{ name }]
    })


    if (existedPlaylist) {
        throw new ApiError(400, "Playlist with same name already exists")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: videos.url
    });


    const options = {
        httpOnly: true,
        secure: true,
    }


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    playlist, options
                },
                "Playlist created successfully"
            )
        )
})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const validUserId = isValidObjectId(userId);

    if (!validUserId) {
        throw new ApiError(401, "Invalid User Id");
    }

    const userPlaylist = await Playlist.find({ userId: validUserId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlaylist,
                "User playlist fetched successfully"
            )
        )
})



const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const validId = isValidObjectId(playlistId);

    if (!validId) {
        throw new ApiError(401, "Inavlid Playlistid")
    }

    const playlistByid = await Playlist.findById(validId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlistByid,
                "Playlist with playlistid fetched successfully"
            )
        )
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    const validId = mongoose.isValidObjectId(playlistId && videoId);

    if (!validId) {
        throw new ApiError(404, "Invalid id")
    }

    const addingVideo = await Playlist.findByIdAndUpdate(
        playlistId,


        {
            $addToSet: {

                videos: videoId

            }
        },

        { new: true }
    )


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                addingVideo,
                "Video added successfully to the playlist"
            )
        )
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    const validId = isValidObjectId(videoId || playlistId);

    if (!validId) {
        throw new Error(404, "Invalid Id for playlist video");
    }

    const videoTobeDeleted = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: { videos: { $in: [videoId] } }
        },

        {
            new: true
        }
    )


    if (!videoTobeDeleted) {
        throw new ApiError(401, "Video cannot be deleted")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoTobeDeleted,
                "Video deleted successfully from the playlist"
            )
        )

})


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const validId = mongoose.isValidObjectId(playlistId);

    if (!validId) {
        throw new ApiError(404, "Invalid")
    }


    try {
        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
        return res
            .status(200)
            .json(
                200,
                new ApiResponse(
                    200,
                    deletedPlaylist,
                    "Playlist deleted successfully"
                )
            )

    } catch (error) {
        throw new ApiError(401, error, "Playlist cannot be deleted");
    }

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description, videos } = req.body;

    const validId = mongoose.isValidObjectId(playlistId);

    if (!validId) {
        throw new ApiError(404, "Invalid playlistId");
    }

    const updatingPlaylist = await Playlist.findByIdAndUpdate(
        { id: playlistId },

        {
            $set: {
                name: name,
                description: description
            }
        },

        { new: true }
    );


    if (!updatingPlaylist) {
        throw new ApiError(401, "error updating playlist")
    }

    return res
        .status(200)
        .json(
            200,
            new ApiResponse(
                200,
                updatePlaylist,
                "Playlist updated successfully"
            )
        )
})




export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}


