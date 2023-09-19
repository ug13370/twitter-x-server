import mongoose from "mongoose";
const tweetMediaRelationshipSchema = new mongoose.Schema({
    tweet_id: {
        trim: true,
        type: String,
        required: [true, "tweet_id is required!"],
    },
    media_id: {
        trim: true,
        type: String,
        required: [true, "media_id is required!"],
    },
    description: {
        trim: true,
        type: String,
        maxLength: 500,
    },
    order: { type: Number, min: 1, required: [true, "order is required!"] },
}, { timestamps: true, validateBeforeSave: true });
// Create the Tweet Media relationship model
const TweetMediaRelationship = mongoose.model("TweetMediaRelationship", tweetMediaRelationshipSchema);
export default TweetMediaRelationship;
//# sourceMappingURL=tweet-media-relationship.js.map