"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegisterNewPassword = exports.handleUserToUnfollow = exports.handleCreateNewUser = exports.handleUserToFollow = void 0;
const user_1 = __importDefault(require("../../models/User/user"));
const password_1 = __importDefault(require("../../models/User/password"));
const user_user_relationship_1 = __importDefault(require("../../models/User/user-user-relationship"));
/** Helper Functions */
const handleCreateNewUser = (userDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new user instance.
        const userInstance = new user_1.default(userDetails);
        // Save it in database.
        let savedRes = yield userInstance.save();
        let { user_id, name, email_id, dob } = savedRes._doc;
        // Returning user details.
        console.info("User creation successfull");
        return {
            status: "success",
            message: "User created successfully",
            details: { user_id, name, email_id, dob },
        };
    }
    catch (err) {
        console.info("User creation failed");
        console.log(err);
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleCreateNewUser = handleCreateNewUser;
const handleRegisterNewPassword = (passwordDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new password instance.
        const passwordInstance = new password_1.default(passwordDetails);
        // Save it in database.
        let savedRes = yield passwordInstance.save();
        let { user_id, password } = savedRes._doc;
        // Returning password details.
        console.info("Password registration successfull");
        return {
            status: "success",
            message: "Password registered successfully",
            details: { user_id, password },
        };
    }
    catch (err) {
        console.error("Password registration failed");
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleRegisterNewPassword = handleRegisterNewPassword;
const handleUserToFollow = (relationshipDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new user relationship instance.
        const userRelnInstance = new user_user_relationship_1.default(relationshipDetails);
        // Save it in database.
        let savedRes = yield userRelnInstance.save();
        let { follower_user_id, followee_user_id } = savedRes._doc;
        // Returning password details.
        console.info(`${follower_user_id} followed ${followee_user_id} successfully!`);
        return {
            status: "success",
            message: "User followed successfully!",
            details: `${follower_user_id} followed ${followee_user_id} successfully!`,
        };
    }
    catch (err) {
        console.error("User relationship registration failed");
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleUserToFollow = handleUserToFollow;
const handleUserToUnfollow = (relationshipDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete relationship.
        const deleteRes = yield user_user_relationship_1.default.deleteOne(relationshipDetails);
        // Check if the relationship was successfully deleted
        if (deleteRes.deletedCount === 1) {
            // User relationship deleted successfully
            console.info("User unfollowed " +
                relationshipDetails.followee_user_id +
                " successfully!");
            return {
                status: "success",
                message: "User unfollowed " +
                    relationshipDetails.followee_user_id +
                    " successfully!",
                details: deleteRes,
            };
        }
        else {
            // User not found with the provided user_id
            console.error("User can't unfollow " + relationshipDetails.followee_user_id);
            return {
                status: "error",
                message: "User can't unfollow " + relationshipDetails.followee_user_id,
                details: "User does not follow " + relationshipDetails.followee_user_id,
            };
        }
    }
    catch (err) {
        console.error("User relationship deregistration failed");
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleUserToUnfollow = handleUserToUnfollow;
