"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mediaSchema = new mongoose_1.default.Schema({
    media_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: mongoose_1.default.Types.ObjectId,
        unique: true,
    },
    type: {
        trim: true,
        type: String,
        enum: ["tweet", "profile"],
        required: [true, "media type is required!"],
    },
    data: {
        type: String,
        required: [true, "media data is required"],
    },
}, { timestamps: true, validateBeforeSave: true });
// Create the Password model
const Media = mongoose_1.default.model("Media", mediaSchema);
exports.default = Media;
