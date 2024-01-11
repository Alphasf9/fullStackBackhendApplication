import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


// below format is repeated
const registerUser = asyncHandler(async (req, res) => {
    //steps to register user:-
    // get user details from frontend
    //validation(email is empty or not,correct format of email etc..)
    //check if user is already registered: username || email
    //check for images,check for avatar compulsory
    //upload them to cloudinary,avatar
    //create user object for - create entry in db
    //remove password and refresh token field from response
    //check if response or check for user creation
    // return response

    //1 User details from frontend
    const { fullName, email, username, password } = req.body;
    // console.log(req.body) study it!!
    // console.log("email: " + " " + email);

    //2 validation

    // if(fullName===""){
    //     throw new ApiError(400,"Full name is required")
    // }

    if (
        [fullName, email, username, password].some((field) =>  // The .some() method is used on the array. It checks whether at least one element in the array satisfies a given condition.
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //3 check if user is existing
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]   // first document will return
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // console.log(req.files);

    //4,5 files handlaing
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(req.files)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    } 

    //6 files uplaod multer
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is not available");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // double checking if avatar is not being uploaded
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
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

});

export { registerUser }