"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetMediaRelationshipSchema = new mongoose_1.default.Schema({
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
const TweetMediaRelationship = mongoose_1.default.model("TweetMediaRelationship", tweetMediaRelationshipSchema);
exports.default = TweetMediaRelationship;
