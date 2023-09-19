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
/** Express Imports */
const express_1 = __importDefault(require("express"));
/** Model Imports */
const user_user_relationship_1 = __importDefault(require("../../models/User/user-user-relationship"));
/** Helper Imports */
const helpers_1 = require("./helpers");
/** Middleware Imports */
const tweet_route_1 = require("../../middlewares/tweet_route");
const router = express_1.default.Router();
// Create a tweet (post/comment)
router.post("/tweet", tweet_route_1.createNewTweet, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure request body.
        const { user_id, text_content, type, medias = [] } = req.body;
        // Create a new user with user details
        const tweetCreationRes = yield (0, helpers_1.handleCreateNewTweet)({
            user_id,
            text_content,
            type,
        });
        // Check if tweet creation was successfull
        if (tweetCreationRes.status === "success") {
            // Register medias
            const mediasRegistrationRes = yield (0, helpers_1.handleRegisterTweetMedias)({
                tweet_id: tweetCreationRes.details.tweet_id,
                user_id,
                medias,
            });
            // Check if media registration was successful
            if (mediasRegistrationRes.status === "success") {
                // User and password creation successful
                res.status(201).json({
                    user_id: tweetCreationRes.details.user_id,
                    tweet_id: tweetCreationRes.details.tweet_id,
                    medias: mediasRegistrationRes.details.medias,
                    created_at: tweetCreationRes.details.createdAt,
                    text_content: tweetCreationRes.details.text_content,
                });
            }
            else {
                // Media registrationn failed
                res.status(422).json(mediasRegistrationRes);
            }
        }
        else {
            // User creation failed
            res.status(422).json(tweetCreationRes);
        }
    }
    catch (err) {
        console.error("Tweet creation failed:", err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            details: err.message,
        });
    }
}));
// Edit a tweet
// Like/Dislike a tweet
router.patch("/tweet/feedback", tweet_route_1.giveFeedbackToATweet, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure request body.
        const { user_id, tweet_id, feedback } = req.body;
        // Register Feedback
        const feedbackRegRes = yield (0, helpers_1.handleFeedbackForATweet)({
            user_id,
            tweet_id,
            feedback,
        });
        // Check if feedback registration was successfull
        if (feedbackRegRes.status === "success") {
            res.status(201).json(feedbackRegRes);
        }
        else {
            // Feedback registrationn failed
            res.status(422).json(feedbackRegRes);
        }
    }
    catch (err) {
        console.error("Tweet feedback reg. failed:", err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            details: err.message,
        });
    }
}));
// Fetch timeline
router.get("/tweets/:user_id", tweet_route_1.fetchAllTweets, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweetsToFetchForUserId = [
            req.params.user_id,
            ...(yield user_user_relationship_1.default.find({
                follower_user_id: req.params.user_id,
            })).map((relationship) => {
                return relationship.followee_user_id;
            }),
        ];
        let tweets = [];
        for (let i = 0; i < tweetsToFetchForUserId.length; i++) {
            const tweetsFetchRes = yield (0, helpers_1.handleFetchAllTweetsForAUser)(tweetsToFetchForUserId[i]);
            tweets = [...tweets, ...tweetsFetchRes.details];
            if (tweetsFetchRes.status === "error") {
                res.status(422).json(tweetsFetchRes);
                break;
            }
        }
        tweets.sort((a, b) => b.createdAt - a.createdAt);
        // Returning tweet details.
        console.info("All tweets fetched successfully");
        res.status(200).send({
            status: "success",
            message: "All tweets fetched successfully",
            details: tweets,
        });
    }
    catch (err) {
        console.error("All tweets fetching failed:", err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            details: err.message,
        });
    }
}));
// Fetch all posts for a particular user.
router.get("/my_tweets/:user_id", tweet_route_1.fetchAllTweets, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweetsFetchRes = yield (0, helpers_1.handleFetchAllTweetsForAUser)(req.params.user_id);
        if (tweetsFetchRes.status === "success") {
            // Returning tweet details.
            console.info("My tweets fetched successfully :- " + req.params.user_id);
            res.status(200).send({
                status: "success",
                message: "My tweets fetched successfully :- " + req.params.user_id,
                details: tweetsFetchRes.details,
            });
        }
        else {
            // Tweets fetching failed.
            res.status(422).json(tweetsFetchRes);
        }
    }
    catch (err) {
        console.error("My tweets fetching failed:", err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            details: err.message,
        });
    }
}));
// Fetch all replies for a particular user setwise.
// Fetch all medias.
// Fetch all like medias.
// Delete a tweet
// Delete all tweets for a specific user
module.exports = router;
