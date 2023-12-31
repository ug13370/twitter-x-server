import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    media_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
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
    name: {
      type: String,
      required: [true, "media name is required"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

// Create the Password model
const Media = mongoose.model("Media", mediaSchema);

export default Media;
