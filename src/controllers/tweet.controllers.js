import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { response } from "express"


const createTweet = asyncHandler(async (req, res) => {
    const { author, tweet, profilePhoto } = req.body;


    if (
        [author, tweet, profilePhoto].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }



    const profilePhotoLocalPath = req.files.profilePhoto[0]?.path;

    if (!profilePhotoLocalPath) {
        throw new ApiError(400, 'profilePhoto file is required');
    }


    profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);

    if (!profilePhoto) {
        throw new ApiError(400, "ProfilePhoto file is required")
    }


    const tweetMake = await Tweet.create({
        author,
        profiePhoto: profilePhoto.url,
        tweet
    });


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweetMake,
                "tweet created successfully"
            )
        )
})



const getUserTweets = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const correctTweetid = isValidObjectId(tweetId);

    if (!correctTweetid) {
        throw new ApiError(404, "Invalid Tweetid");
    }

    const { page = 1, limit = 10 } = req.query;


    const tweets = await Tweet.aggregate([
        {
            $match: { author: mongoose.Types.ObjectId(tweetId) }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $skip: (page - 1) * limit
        },

        {
            $limit: parseInt(limit)
        }
    ])


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "tweets fetched successfully"
            )
        )

})



const deleteAuthorProfilePhoto = asyncHandler(async (req, res) => {
    const profilePhotoLocalPath = req.file?.path;

    if (!profilePhotoLocalPath) {
        throw new ApiError(404, "Profile Photo file not found")
    }

    if (profilePhoto.url) {
        throw new ApiError(404, "Error while updating Profile Photo");
    }

    const tweet = Tweet.findOneAndUpdate(
        { id: req.tweet?._id },

        {
            $pull: {
                profilePhoto: { $exists: true }
            }
        },

        { new: true }
    )

    if (!tweet) {
        throw new ApiError(401, "Unable to delete Profile Photo")
    }

})


const updateAuthorProfilePhoto = asyncHandler(async (req, res) => {
    const profilePhotoLocalPath = req.file?.path;

    if (!profilePhotoLocalPath) {
        throw new ApiError(404, "Profile Photo file not found")
    }

    if (profilePhoto.url) {
        throw new ApiError(404, "Error while updating Profile Photo");
    }

    const profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);

    const updatedProfilePhoto = Tweet.findByIdAndUpdate(
        { id: req.tweet?._id },


        {
            $set: {
                profilePhoto: profilePhoto.url,
            }
        }
    )
    if (!updatedProfilePhoto) {
        throw new ApiError(401, "Profile Photo cannot be updated")
    }
})



const updateTweet = asyncHandler(async (req, res) => {

    const { author, tweet, profilePhoto } = req.body;

    if (!author || !tweet) {
        throw new ApiError(400, "All credentials required for")
    }

    const tweeting = await Tweet.findByIdAndUpdate([
        req.tweet._id,
        {
            $set: {
                author: author,
                tweet: tweet
            }
        },

        {
            new: true,
        },

    ])


    deleteAuthorProfilePhoto(req, profilePhoto);
    updateAuthorProfilePhoto(req, profilePhoto);



    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                tweeting, deleteAuthorProfilePhoto, updateAuthorProfilePhoto
            },
            "Details updated successfully"))

})


const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;


    if (!tweetId) {
        throw new ApiError(404, "Invalid tweetid");
    }


    const deletingTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletingTweet) {
        throw new ApiError(404, "Something went wrong while deleting tweet");
    }



    return res
        .status(200)
        .json(new ApiResponse(200,
            deletingTweet,
            "Details updated successfully")
        )
})


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}