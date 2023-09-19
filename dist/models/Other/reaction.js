"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reactionSchema = new mongoose_1.default.Schema({
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
const Reaction = mongoose_1.default.model("Reaction", reactionSchema);
exports.default = Reaction;
