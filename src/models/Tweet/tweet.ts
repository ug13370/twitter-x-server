import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    tweet_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
      unique: true,
    },
    user_name: {
      trim: true,
      type: String,
      required: [true, "user_name is required!"],
    },
    user_id: {
      trim: true,
      type: String,
      required: [true, "user_id is required!"],
    },
    text_content: {
      trim: true,
      type: String,
      default: "",
    },
    parent_tweet_id: {
      trim: true,
      default: "",
      type: String,
    },
    no_of_likes: {
      min: 0,
      default: 0,
      type: Number,
    },
    no_of_comments: {
      min: 0,
      default: 0,
      type: Number,
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

// Create the Password model
const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
