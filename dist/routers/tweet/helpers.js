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
exports.handleFetchAllTweetsForAUser = exports.handleRegisterTweetMedias = exports.handleFeedbackForATweet = exports.handleCreateNewTweet = void 0;
const media_1 = __importDefault(require("../../models/Other/media"));
const tweet_1 = __importDefault(require("../../models/Tweet/tweet"));
const reaction_1 = __importDefault(require("../../models/Other/reaction"));
const tweet_media_relationship_1 = __importDefault(require("../../models/Tweet/tweet-media-relationship"));
const handleCreateNewTweet = (tweetDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new tweet instance.
        const tweetInstance = new tweet_1.default(tweetDetails);
        // Save it in database.
        let savedRes = yield tweetInstance.save();
        let { tweet_id, user_id, text_content, createdAt } = savedRes._doc;
        // Returning tweet details.
        console.info("Tweet creation successfull");
        return {
            status: "success",
            message: "Tweet created successfully",
            details: { tweet_id, user_id, text_content, createdAt },
        };
    }
    catch (err) {
        console.info("Tweet creation failed");
        console.log(err);
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleCreateNewTweet = handleCreateNewTweet;
const handleRegisterTweetMedias = (mediaDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let savedMedias = [];
        for (let i = 0; i < mediaDetails.medias.length; i++) {
            let media = mediaDetails.medias[i];
            // Create a new media instance.
            const mediaInstance = new media_1.default({ type: "tweet", data: media.data });
            // Save it in database.
            let tweetSavedRes = yield mediaInstance.save();
            let { media_id } = tweetSavedRes._doc;
            // Append into saved media.
            savedMedias.push(Object.assign(Object.assign({}, media), { media_id }));
            // Create a new tweet-media relationship instance.
            const tweetMediaRelnInstance = new tweet_media_relationship_1.default({
                tweet_id: mediaDetails.tweet_id,
                media_id,
                description: media.description,
                order: i + 1,
            });
            // Save it in database.
            let tweetMediaRelnSavedRes = yield tweetMediaRelnInstance.save();
        }
        // Returning tweet media details.
        console.info("Tweet media registration successfull");
        return {
            status: "success",
            message: "Tweet medias registration successfull",
            details: { medias: savedMedias },
        };
    }
    catch (err) {
        console.info("Media registration failed:", err);
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleRegisterTweetMedias = handleRegisterTweetMedias;
const handleFetchAllTweetsForAUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tweets = yield Promise.all((yield tweet_1.default.find({ user_id })).map(({ tweet_id, user_id, text_content, no_of_likes, createdAt }) => __awaiter(void 0, void 0, void 0, function* () {
            let medias = yield Promise.all((yield tweet_media_relationship_1.default.find({ tweet_id })).map(({ media_id, description, order }) => __awaiter(void 0, void 0, void 0, function* () {
                let { data } = yield media_1.default.findOne({ media_id: media_id });
                return { media_id, data, description, order };
            })));
            return {
                tweet_id,
                user_id,
                text_content,
                createdAt,
                no_of_likes,
                medias,
            };
        })));
        // Returning all tweets.
        console.info("Tweet fetched successfully for " + user_id);
        return {
            status: "success",
            message: "Tweet fetched successfully for " + user_id,
            details: tweets,
        };
    }
    catch (err) {
        console.info("Tweets fetching failed:", err);
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleFetchAllTweetsForAUser = handleFetchAllTweetsForAUser;
const handleFeedbackForATweet = (feedbackDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Incrementing/Decrementing no_of_likes based on the feedback flag.
        const tweetUpdateRes = yield tweet_1.default.updateOne({ tweet_id: feedbackDetails.tweet_id }, { $inc: { no_of_likes: feedbackDetails.feedback ? 1 : -1 } });
        // If user liked the tweet.
        if (feedbackDetails.feedback) {
            // Registering user's reaction.
            const newReactionInstance = new reaction_1.default({
                user_id: feedbackDetails.user_id,
                tweet_id: feedbackDetails.tweet_id,
            });
            // Saving in DB.
            const reactionCreationRes = yield newReactionInstance.save();
        }
        else {
            const reactionDeletionRes = yield reaction_1.default.deleteOne({
                user_id: feedbackDetails.user_id,
                tweet_id: feedbackDetails.tweet_id,
            });
        }
        // Feedback registered successfully.
        console.info("Tweet feedback reg. successfully");
        return {
            status: "success",
            message: "Tweet feedback reg. successfully",
            details: tweetUpdateRes,
        };
    }
    catch (err) {
        console.info("Tweet feedback reg. failed:", err);
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleFeedbackForATweet = handleFeedbackForATweet;
