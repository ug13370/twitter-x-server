var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/User/user"; // Import your User model
// Function to check if an user ID already exists in the database
function isUserIdExisting(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find a instance with the provided user_id
            const res = yield User.exists({ user_id: userId });
            // If instance exists return false otherwise return true.
            if (res === null) {
                console.log("User ID exists.");
                return false;
            }
            else {
                console.log("User ID does not exists.");
                return true;
            }
        }
        catch (err) {
            // Handle any errors that may occur during the existence check
            console.error("User ID existence check failed:", err);
            return true;
        }
    });
}
export default isUserIdExisting;
//# sourceMappingURL=isUserIdExisting.js.map