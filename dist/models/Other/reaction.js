import mongoose from "mongoose";
const reactionSchema = new mongoose.Schema({
    user_id: {
        trim: true,
        type: String,
        required: [true, "user_id is required!"],
    },
    tweet_id: {
        trim: true,
        type: String,
        required: [true, "tweet_id is required!"],
    },
}, { timestamps: true, validateBeforeSave: true });
// Define a compound unique index on user_id and tweet_id
reactionSchema.index({ user_id: 1, tweet_id: 1 }, { unique: true });
// Create the Password model
const Reaction = mongoose.model("Reaction", reactionSchema);
export default Reaction;
//# sourceMappingURL=reaction.js.map