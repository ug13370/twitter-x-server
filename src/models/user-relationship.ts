import mongoose from "mongoose";

const userRelationshipSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true, validateBeforeSave: true }
);

// Define a compound unique index on follower_user_id and followee_user_id
userRelationshipSchema.index(
  { follower_user_id: 1, followee_user_id: 1 },
  { unique: true }
);

// Create the Password model
const UserRelationship = mongoose.model(
  "UserRelationship",
  userRelationshipSchema
);

export default UserRelationship;
