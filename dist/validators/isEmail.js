"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
function isEmail(value) {
    // Use the validator library to check if the value is a valid email address.
    const validationResult = validator_1.default.isEmail(value);
    // Log validation results to the console.
    if (validationResult) {
        console.info(`Email validation passed.`);
    }
    else {
        console.error(`Email validation failed.`);
    }
    // Return the validation result (true for valid, false for invalid).
    return validationResult;
}
exports.default = isEmail;
