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
exports.giveFeedbackToATweet = exports.fetchAllTweets = exports.createNewTweet = void 0;
const joi_1 = __importDefault(require("joi"));
const reaction_1 = __importDefault(require("../models/Other/reaction"));
const isUserIdExisting_1 = __importDefault(require("../validators/isUserIdExisting"));
const isTweetIdExisting_1 = __importDefault(require("../validators/isTweetIdExisting"));
const createNewTweet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const mediaSchema = joi_1.default.object({
            description: joi_1.default.string().max(100).optional(),
            data: joi_1.default.string().required(),
        });
        const reqSchema = joi_1.default.object({
            user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            text_content: joi_1.default.string().min(1).optional(),
            type: joi_1.default.string().valid("post", "comment").required(),
            medias: joi_1.default.array().items(mediaSchema).optional(),
        })
            .options({ abortEarly: false })
            .custom((value, helpers) => {
            // Ensure that either text_content or medias (or both) are present but not both
            const { text_content, medias } = value;
            if (!text_content && !medias) {
                return helpers.message({
                    custom: "Either text_content or medias (or both) should be present",
                });
            }
            return value;
        });
        try {
            // Validate the request param against the schema
            yield reqSchema.validateAsync(req.body);
            // If validation passes, continue with the request handling.
            console.info("Create new tweet route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("Create new tweet route middleware failed.");
            res.status(422).json({
                status: "error",
                message: "Incorrect payload",
                details: err.details,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while follow/unfollow user middleware.",
            details: err.details,
        });
    }
});
exports.createNewTweet = createNewTweet;
const fetchAllTweets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqSchema = joi_1.default.object({
        user_id: joi_1.default.string().regex(/^@/).required().external(isUserIdExistingInDB),
    }).options({ abortEarly: false });
    try {
        // Validate the request param against the schema
        yield reqSchema.validateAsync(req.params);
        // If validation passes, continue with the request handling.
        console.info("Fetch all tweets route middleware passed.");
        next();
    }
    catch (err) {
        // If there's a validation error, respond with a 422 status and error message.
        console.error("Fetch all tweets route middleware failed.");
        res.status(422).json({
            status: "error",
            message: "Incorrect payload",
            details: err.details,
        });
    }
});
exports.fetchAllTweets = fetchAllTweets;
const giveFeedbackToATweet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqSchema = joi_1.default.object({
        user_id: joi_1.default.string().regex(/^@/).required().external(isUserIdExistingInDB),
        tweet_id: joi_1.default.string().required().external(isTweetIdExistingInDB),
        feedback: joi_1.default.boolean().required(),
    })
        .options({ abortEarly: false })
        .external((value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id, tweet_id, feedback } = value;
        const foundDocument = yield reaction_1.default.findOne({
            user_id: user_id,
            tweet_id: tweet_id,
        });
        if (foundDocument === null) {
            if (!feedback) {
                console.log("User want to dislike a tweet which the user never liked.");
                return helpers.message({
                    external: "User want to dislike a tweet which the user never liked.",
                });
            }
        }
        else {
            if (feedback) {
                console.log("User want to like a tweet which the user already liked.");
                return helpers.message({
                    external: "User want to like a tweet which the user already liked.",
                });
            }
        }
        return value;
    }));
    try {
        // Validate the request param against the schema
        yield reqSchema.validateAsync(req.body);
        // If validation passes, continue with the request handling.
        console.info("Give feedback to a tweet route middleware passed.");
        next();
    }
    catch (err) {
        // If there's a validation error, respond with a 422 status and error message.
        console.error("Give feedback to a tweet route middleware failed.");
        res.status(422).json({
            status: "error",
            message: "Incorrect payload",
            details: err.details,
        });
    }
});
exports.giveFeedbackToATweet = giveFeedbackToATweet;
/** Helpers */
const isUserIdExistingInDB = (value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = yield (0, isUserIdExisting_1.default)(value);
        if (res)
            return value;
        else
            return helpers.message({
                external: "user_id does not exists",
            });
    }
    catch (error) {
        return helpers.message({
            external: "An error occurred while checking user_id existence",
        });
    }
});
const isTweetIdExistingInDB = (value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = yield (0, isTweetIdExisting_1.default)(value);
        if (res)
            return value;
        else
            return helpers.message({
                external: "tweet_id does not exists",
            });
    }
    catch (error) {
        return helpers.message({
            external: "An error occurred while checking tweet_id existence",
        });
    }
});
