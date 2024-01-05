import mongoose, { Schema } from 'mongoose';
import jwt from 'jwt';
import brcypt from 'brcypt';

const userSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,  // searchable and get in databse searching
    },

    email: {
        type: 'String',
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    fullName: {
        type: 'String',
        required: true,
        trim: true,
        index: true,
    },

    avatar: {
        type: 'String',  //cloudinary url
        required: true,
    },

    coverImage: {
        type: 'String',
    },

    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        }
    ],

    password: {
        type: 'String',
        required: [true, 'Password is required']
    },

    refreshToken: {
        type: 'String',
    }

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = brcypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await brcypt.compare(password, this.password)// comapring password
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,  // kya kya information rakhe jaye
            email: this.email,
            username: this.username,
            fullName: this.fullName   //this.fullName is coming from databse
        },

        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);