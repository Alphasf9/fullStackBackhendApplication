// This middleware will verify if user is there or not

import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)//token verified
        const user = await User.findById(decodedToken?._id).select(
            "-password  -refreshToken"
        )

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Inavlid access token"); // message decoded of error
    }
})