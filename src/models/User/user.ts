import mongoose from "mongoose";
import Password from "./password";
import isEmail from "../../validators/isEmail";
import UserRelationship from "./user-user-relationship";

// Define the interface for User documents
interface UserDocument extends mongoose.Document {
  user_id: string;
  name: string;
  email_id: string;
  bio?: string;
  location?: string;
  primary_media_id?: any;
  secondary_media_id?: any;
}

// Create a Mongoose schema for the User
const userSchema = new mongoose.Schema(
  {
    user_id: {
      trim: true,
      type: String,
      unique: true,
      required: [true, "user_id is required."],
    },
    name: {
      trim: true,
      type: String,
      required: [true, "name is required."],
    },
    email_id: {
      trim: true,
      unique: true,
      type: String,
      lowercase: true,
      required: [true, "Email Id is required."],
      validate: {
        validator: isEmail, // Custom validator for email format
        message: (props: any) => `${props.value} is not a valid email Id!`,
      },
    },
    dob: {
      trim: true,
      type: Date,
      required: [true, "DOB is required."],
    },
    bio: {
      trim: true,
      minLength: 1,
      type: String,
      maxLength: 100,
    },
    location: { trim: true, type: String },
    primary_media_id: {},
    secondary_media_id: {},
  },
  { timestamps: true, validateBeforeSave: true } // Adds createdAt and updatedAt fields
);

// Pre-remove hook to delete a single password when a user is deleted
userSchema.pre("deleteOne", async function (next) {
  try {
    // Delete a single password based on the filter criteria
    await Password.deleteOne(this.getFilter());
    console.log("Password de-registered successfully.");

    try {
      const condition = {
        $or: [
          { follower_user_id: this.getFilter().user_id },
          { followee_user_id: this.getFilter().user_id },
        ],
      };

      // Delete all user relationships.
      await UserRelationship.deleteMany(condition);
      console.log("User relationships deleted successfully.");
      next();
    } catch (err: any) {
      // Handle any errors that may occur during user relationship deletion
      console.error("User relationship deletion failed:", err);
      next(err);
    }
  } catch (err: any) {
    // Handle any errors that may occur during password deletion
    console.error("Password de-registration failed:", err);
    next(err);
  }
});

// Pre-remove hook to delete all passwords when multiple users are deleted
userSchema.pre("deleteMany", async function (next) {
  try {
    // Delete all passwords
    await Password.deleteMany({});
    console.log("Passwords de-registered successfully.");

    try {
      // Delete all user relationships.
      await UserRelationship.deleteMany({});
      console.log("User relationships deleted successfully.");
      next();
    } catch (err: any) {
      // Handle any errors that may occur during user relationship deletion
      console.error("User relationships deletion failed:", err);
      next(err);
    }
  } catch (err: any) {
    // Handle any errors that may occur during password deletion
    console.error("Passwords de-registration failed:", err);
    next(err);
  }
});

// Create the User model
const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
