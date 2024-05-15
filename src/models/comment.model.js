import mongoose from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


const commentSchema = new mongoose.Schema({
    name: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    description: [
        {
            type: 'String',
            required: true
        }
    ]
},
    { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate)


export const Comment = mongoose.model("Comment", commentSchema);