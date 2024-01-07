import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    //steps to register user:-
    // get user details from frontend
    //validation(email is empty or not,correct format of email etc..)
    //check if user is already registered: username || email
    //check for images
    //check for avatar compulsory
    //uplaod them to cloudinary,avatar
    //create user object for - create entry in db
    //remove password and refresh token field from response
    //check if response or check for user creation
    // return response

    //1 User details from frontend
    const { fullName, email, username, password } = req.body;
    console.log("email: " + " " + email);

    //2 validation

    // if(fullName===""){
    //     throw new ApiError(400,"Full name is required")
    // }

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //3 check if user is existing
    const existedUser = User.findOne({
        $or: [{ username }, { email }]   // first dicument will return
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    //4,5 files handlaing
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    //6 files uplaod multer
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is not available");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApiError(400, "Avatar is not available");
    }
    //7 databse uplaod
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || " ", //localfile path
        email,
        password,
        username: username.toLowerCase(),
    });


    // check if user is empty or creatd 
    // remove refresh token and password
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // these fields will not come
    )

    // user properly created
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registenring user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

});

export { registerUser }