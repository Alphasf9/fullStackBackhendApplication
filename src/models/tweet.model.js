import mongoose ,{Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const tweetSchema = new mongoose.Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },


        tweet: {
            type: "String",
            required: true
        },

        profilePhoto: {
            type: "String",
            required: true
        }
    },
    { timestamps: true });



tweetSchema.plugin(mongooseAggregatePaginate);


export const Tweet = mongoose.model("Tweet", tweetSchema);