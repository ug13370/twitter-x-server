import mongoose from "mongoose";

const tweetMediaRelationshipSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true, validateBeforeSave: true }
);

// Define a compound unique index on parent_tweet_id and child_tweet_id
tweetMediaRelationshipSchema.index(
  { parent_tweet_id: 1, child_tweet_id: 1 },
  { unique: true }
);

// Create the Password model
const TweetTweetRelationship = mongoose.model(
  "TweetTweetRelationship",
  tweetMediaRelationshipSchema
);

export default TweetTweetRelationship;
