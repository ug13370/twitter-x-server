var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import Password from "./password";
import isEmail from "../../validators/isEmail";
import UserRelationship from "./user-user-relationship";
// Create a Mongoose schema for the User
const userSchema = new mongoose.Schema({
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
            validator: isEmail,
            message: (props) => `${props.value} is not a valid email Id!`,
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
}, { timestamps: true, validateBeforeSave: true } // Adds createdAt and updatedAt fields
);
// Pre-remove hook to delete a single password when a user is deleted
userSchema.pre("deleteOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete a single password based on the filter criteria
            yield Password.deleteOne(this.getFilter());
            console.log("Password de-registered successfully.");
            try {
                const condition = {
                    $or: [
                        { follower_user_id: this.getFilter().user_id },
                        { followee_user_id: this.getFilter().user_id },
                    ],
                };
                // Delete all user relationships.
                yield UserRelationship.deleteMany(condition);
                console.log("User relationships deleted successfully.");
                next();
            }
            catch (err) {
                // Handle any errors that may occur during user relationship deletion
                console.error("User relationship deletion failed:", err);
                next(err);
            }
        }
        catch (err) {
            // Handle any errors that may occur during password deletion
            console.error("Password de-registration failed:", err);
            next(err);
        }
    });
});
// Pre-remove hook to delete all passwords when multiple users are deleted
userSchema.pre("deleteMany", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete all passwords
            yield Password.deleteMany({});
            console.log("Passwords de-registered successfully.");
            try {
                // Delete all user relationships.
                yield UserRelationship.deleteMany({});
                console.log("User relationships deleted successfully.");
                next();
            }
            catch (err) {
                // Handle any errors that may occur during user relationship deletion
                console.error("User relationships deletion failed:", err);
                next(err);
            }
        }
        catch (err) {
            // Handle any errors that may occur during password deletion
            console.error("Passwords de-registration failed:", err);
            next(err);
        }
    });
});
// Create the User model
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=user.js.map