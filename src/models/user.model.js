import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';  //hash your password

const userSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,  // searchable and get in database searching
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
    this.password = await bcrypt.hash(this.password, 10);
    //(kya bcrypt karna hai,rounds number)
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)// comparing password
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,  // kya kya information rakhe jaye
            email: this.email,
            username: this.username,
            fullName: this.fullName   //this.fullName is coming from database
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
            // email: this.email,
            // username: this.username,
            // fullName: this.fullName
        },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);