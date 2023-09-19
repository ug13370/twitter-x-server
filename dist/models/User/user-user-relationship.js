"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userUserRelationshipSchema = new mongoose_1.default.Schema({
    follower_user_id: {
        trim: true,
        type: String,
        required: [true, "user_id is required!"],
    },
    followee_user_id: {
        trim: true,
        type: String,
        required: [true, "user_id is required!"],
    },
}, { timestamps: true, validateBeforeSave: true });
// Define a compound unique index on follower_user_id and followee_user_id
userUserRelationshipSchema.index({ follower_user_id: 1, followee_user_id: 1 }, { unique: true });
// Create the Password model
const UserUserRelationship = mongoose_1.default.model("UserUserRelationship", userUserRelationshipSchema);
exports.default = UserUserRelationship;
