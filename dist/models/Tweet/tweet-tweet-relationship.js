"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetTweetRelationshipSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true, validateBeforeSave: true });
// Define a compound unique index on parent_tweet_id and child_tweet_id
tweetTweetRelationshipSchema.index({ parent_tweet_id: 1, child_tweet_id: 1 }, { unique: true });
// Create the Password model
const TweetTweetRelationship = mongoose_1.default.model("TweetTweetRelationship", tweetTweetRelationshipSchema);
exports.default = TweetTweetRelationship;
