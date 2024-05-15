import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const healthCheck = asyncHandler(async (req, res) => {
    try {
        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Health Check Success"
                )
            )
    } catch (error) {
        throw new ApiError(404, "Health Check Failure :", error)
    }
})

export {
    healthCheck
}