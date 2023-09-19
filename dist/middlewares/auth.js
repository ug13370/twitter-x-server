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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNormalUserAuthCheck = void 0;
const isNormalUserAuthCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.userId) {
            next(); // Normal User is authenticated, continue to next middleware
        }
        else {
            // If there's a validation error, respond with a 422 status and error message.
            console.error("Normal user auth middleware failed.");
            res.status(422).json({
                status: "error",
                message: "User authentication failed",
                details: "Login again",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while normal user auth check middleware.",
            details: err.details,
        });
    }
});
exports.isNormalUserAuthCheck = isNormalUserAuthCheck;
