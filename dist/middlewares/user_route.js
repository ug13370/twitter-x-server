var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Joi from "joi";
import isEmailIdExisting from "../validators/isEmailExisting";
import isUserIdExisting from "../validators/isUserIdExisting";
import isPassword from "../validators/isPassword";
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = Joi.object({
            user_id: Joi.string()
                .regex(/^@/)
                .required()
                .external(isUserIdNotExistingInDB),
            name: Joi.string().required(),
            email_id: Joi.string()
                .email({ tlds: { allow: false } })
                .required()
                .external(isEmailIdExistingInDB),
            password: Joi.string().min(5).required().custom(hasTwoSpecialChars),
            dob: Joi.date().iso().required(),
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
const updateSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = Joi.object({
            user_id: Joi.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            name: Joi.string().optional(),
            dob: Joi.date().iso().optional(),
            bio: Joi.string().optional(),
            location: Joi.string().optional(),
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
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = Joi.object({
            user_id: Joi.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            new_password: Joi.string().required().external(isPasswordValid),
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
const deleteSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = Joi.object({
            user_id: Joi.string()
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
const followOrUnfollowUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = Joi.object({
            follower_user_id: Joi.string()
                .regex(/^@/)
                .required()
                .external(isUserIdExistingInDB),
            followee_user_id: Joi.string()
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
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the request schema using Joi inside the function
        const reqSchema = Joi.object({
            email_id: Joi.string().required(),
            password: Joi.string().required(),
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
        let res = yield isEmailIdExisting(value);
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
        let res = yield isUserIdExisting(value);
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
        let res = yield isUserIdExisting(value);
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
        let res = isPassword(value);
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
export { login, createNewUser, updateSingleUser, deleteSingleUser, updateUserPassword, followOrUnfollowUser, };
//# sourceMappingURL=user_route.js.map