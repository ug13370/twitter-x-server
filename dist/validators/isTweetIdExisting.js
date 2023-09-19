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
const tweet_1 = __importDefault(require("../models/Tweet/tweet"));
// Function to check if an user ID already exists in the database
function isTweetIdExisting(tweetId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find a instance with the provided tweet_id
            const res = yield tweet_1.default.exists({ tweet_id: tweetId });
            // If instance exists return false otherwise return true.
            if (res === null) {
                console.log("User ID does not exists.");
                return false;
            }
            else {
                console.log("Tweet ID exists.");
                return true;
            }
        }
        catch (err) {
            // Handle any errors that may occur during the existence check
            console.error("Tweet ID existence check failed:", err);
            return false;
        }
    });
}
exports.default = isTweetIdExisting;
