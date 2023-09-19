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
exports.followOrUnfollowUser = exports.updateUserPassword = exports.deleteSingleUser = exports.updateSingleUser = exports.createNewUser = exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const isEmailExisting_1 = __importDefault(require("../validators/isEmailExisting"));
const isUserIdExisting_1 = __importDefault(require("../validators/isUserIdExisting"));
const isPassword_1 = __importDefault(require("../validators/isPassword"));
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = joi_1.default.object({
            user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdNotExistingInDB),
            name: joi_1.default.string().required(),
            email_id: joi_1.default.string()
                .email({ tlds: { allow: false } })
                .required()
                .external(isEmailIdExistingInDB),
            password: joi_1.default.string().min(5).required().custom(hasTwoSpecialChars),
            dob: joi_1.default.date().iso().required(),
        }).options({ abortEarly: false });
        try {
            // Validate the request body against the schema
            yield reqSchema.validateAsync(req.body);
            // If validation passes, continue with the request handling.
            console.info("User creation route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("User creation route middleware failed.");
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
            message: "An error occurred while running user creation middleware.",
            details: err.details,
        });
    }
});
exports.createNewUser = createNewUser;
const updateSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = joi_1.default.object({
            user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            name: joi_1.default.string().optional(),
            dob: joi_1.default.date().iso().optional(),
            bio: joi_1.default.string().optional(),
            location: joi_1.default.string().optional(),
        }).options({ abortEarly: false });
        try {
            // Validate the request body against the schema
            yield reqSchema.validateAsync(req.body);
            // If validation passes, continue with the request handling.
            console.info("User updation route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("User updation route middleware failed.");
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
            message: "An error occurred while running user updation middleware.",
            details: err.details,
        });
    }
});
exports.updateSingleUser = updateSingleUser;
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = joi_1.default.object({
            user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            new_password: joi_1.default.string().required().external(isPasswordValid),
        }).options({ abortEarly: false });
        try {
            // Validate the request body against the schema
            yield reqSchema.validateAsync(req.body);
            // If validation passes, continue with the request handling.
            console.info("User's password updation route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("User's password updation route middleware failed.");
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
            message: "An error occurred while running user's password updation middleware.",
            details: err.details,
        });
    }
});
exports.updateUserPassword = updateUserPassword;
const deleteSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = joi_1.default.object({
            user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
        }).options({ abortEarly: false });
        try {
            // Validate the request param against the schema
            yield reqSchema.validateAsync(req.params);
            // If validation passes, continue with the request handling.
            console.info("Delete single user route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("Delete single user route middleware failed.");
            res.status(422).json({
                status: "error",
                message: "Incorrect params",
                details: err.details,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while running single user deletion middleware.",
            details: err.details,
        });
    }
});
exports.deleteSingleUser = deleteSingleUser;
const followOrUnfollowUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = joi_1.default.object({
            follower_user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            followee_user_id: joi_1.default.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
        }).options({ abortEarly: false });
        try {
            // Validate the request param against the schema
            yield reqSchema.validateAsync(req.body);
            // If validation passes, continue with the request handling.
            console.info("follow/unfollow user route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("follow/unfollow user route middleware failed.");
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
exports.followOrUnfollowUser = followOrUnfollowUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = joi_1.default.object({
            email_id: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
        }).options({ abortEarly: false });
        try {
            // Validate the request param against the schema
            yield reqSchema.validateAsync(req.body);
            // If validation passes, continue with the request handling.
            console.info("Login user route middleware passed.");
            next();
        }
        catch (err) {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("Login user route middleware failed.");
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
            message: "An error occurred in login user middleware.",
            details: err.details,
        });
    }
});
exports.login = login;
/** Helper functions */
const hasTwoSpecialChars = (value, helpers) => {
    const specialChars = value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/g) || [];
    if (specialChars.length >= 2) {
        return value; // Validation passed
    }
    return helpers.message({
        custom: "must contain at least 2 special characters",
    });
};
const isEmailIdExistingInDB = (value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = yield (0, isEmailExisting_1.default)(value);
        if (!res)
            return value;
        else
            return helpers.message({
                external: "email_id already exists",
            });
    }
    catch (error) {
        return helpers.message({
            external: "An error occurred while checking email_id existence",
        });
    }
});
const isUserIdNotExistingInDB = (value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = yield (0, isUserIdExisting_1.default)(value);
        if (!res)
            return value;
        else
            return helpers.message({
                external: "user_id already exists",
            });
    }
    catch (error) {
        return helpers.message({
            external: "An error occurred while checking user_id existence",
        });
    }
});
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
const isPasswordValid = (value, helpers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = (0, isPassword_1.default)(value);
        if (res)
            return value;
        else
            return helpers.message({ external: "Invalid Password" });
    }
    catch (error) {
        return helpers.message({
            external: "An error occurred while checking password validity",
        });
    }
});
