import Tweet from "./tweet";
import mongoose from "mongoose";

const tweetTweetRelationshipSchema = new mongoose.Schema(
  {
    parent_tweet_id: {
      trim: true,
      type: String,
      required: [true, "tweet_id is required!"],
    },
    child_tweet_id: {
      trim: true,
      type: String,
      required: [true, "tweet_id is required!"],
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

// Define a compound unique index on parent_tweet_id and child_tweet_id
tweetTweetRelationshipSchema.index(
  { parent_tweet_id: 1, child_tweet_id: 1 },
  { unique: true }
);

// Pre save functions
tweetTweetRelationshipSchema.pre("save", async function (next) {
  try {
    var self: any = this;
    await Tweet.updateOne(
      { tweet_id: self.parent_tweet_id },
      { $inc: { no_of_comments: 1 } }
    );
    console.log("Tweet Tweet relationship pre save successfully ran.");
  } catch (error: any) {
    console.log("Tweet Tweet relationship pre save :- ", error);
  }
});

// Create the Password model
const TweetTweetRelationship = mongoose.model(
  "TweetTweetRelationship",
  tweetTweetRelationshipSchema
);

export default TweetTweetRelationship;
