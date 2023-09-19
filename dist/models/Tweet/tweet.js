"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetSchema = new mongoose_1.default.Schema({
    tweet_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: mongoose_1.default.Types.ObjectId,
        unique: true,
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
    type: {
        trim: true,
        type: String,
        enum: ["post", "comment"],
        required: [true, "tweet type is required!"],
    },
    no_of_likes: {
        min: 0,
        default: 0,
        type: Number,
    },
}, { timestamps: true, validateBeforeSave: true });
// Create the Password model
const Tweet = mongoose_1.default.model("Tweet", tweetSchema);
exports.default = Tweet;
