import mongoose from "mongoose";

const userUserRelationshipSchema = new mongoose.Schema(
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
userUserRelationshipSchema.index(
  { follower_user_id: 1, followee_user_id: 1 },
  { unique: true }
);

// Create the Password model
const UserUserRelationship = mongoose.model(
  "UserUserRelationship",
  userUserRelationshipSchema
);

export default UserUserRelationship;
