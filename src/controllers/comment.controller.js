import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import { response } from 'express'

const getvideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const { page = 1, limit = 10 } = req.query;


    const comments = await Comment.aggregate([
        {
            $match: { name: mongoose.Types.ObjectId(videoId) }
        },


        {
            $sort: {
                createdAt: -1,
            }
        },


        {
            $skip: (page - 1) * limit
        },


        {
            $limit: parseInt(limit)
        }
    ])


    return res.
        status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "Comments fetched successfully"
            )
        )


})



const addComment = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { commentId } = req.params;

    if (
        [name, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const newComment = {
        name: name,
        description: description
    };


    try {
        const userComment = await Comment.findByIdAndUpdate(commentId,
            {
                $push: { comments: newComment }
            },

            {
                new: true
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    userComment,
                    "Commented successfully"
                )
            )

    } catch (error) {
        throw new ApiError(404, "Comment cannot be made", error);
    }



})

const updateComment = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { commentId } = req.params;

    try {
        const updatedCommentUser = Comment.findByIdAndUpdate(
            {
                id: commentId,
            },

            {
                $set: {
                    name: name,
                    description: description
                }
            },

            {
                new: true
            }
        )


        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedCommentUser,
                    "Comment updated successfully"
                )
            )
    } catch (error) {
        throw new ApiError(404, "error updating comment")
    }
})



const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const userComment = await Comment.findByIdAndDelete(commentId);

    if (!userComment) {
        throw new ApiError(404, "Comment cannot be deleted");
    }


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userComment,
                "Comment deleted successfully"
            )
        )
})



export {
    getvideoComments,
    addComment,
    updateComment,
    deleteComment
}