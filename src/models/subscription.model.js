import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
    subcriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Subcription = mongoose.model('Subscription', subscriptionSchema);
