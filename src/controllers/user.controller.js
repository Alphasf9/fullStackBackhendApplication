import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken(); //mehtods 
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken; // refreshtoken in databse
        await user.save({ validateBeforeSave: false }); // just save without validation
        return { accessToken, refreshToken }; //access token generated
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


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
    /*
    const { fullName, email, username, password } = req.body;
    The above line is equivalent to
    const fullName = req.body.fullName;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    */
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

    //4,5 files handling
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(req.files)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log("This is avatar local file path", avatarLocalPath);

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

/*
username or email
find the user
password check
access and refresh token
send cookie
*/
const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body

    if (!username || !email) {
        throw new ApiError(400, "Credentials are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials");
    }

    //if user password is correct generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = User.findById(user._id).select(
        "-password -refreshToken" // we dont't want to send these back
    )

    //send to cookies

    const options = {
        httpOnly: true, // server can access and modified only by server not by frontend
        secure: true     // frontend can modify these cookies
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                    // cookie save by user
                }),
            "User logged in successfully"
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true //update
        },
    )
    const options = {
        httpOnly: true,
        secure: true
    }
})

return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
        200, {}, "User logged out successfully"
    ))

export {
    registerUser,
    loginUser,
    logoutUser
}