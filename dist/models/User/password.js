"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const isPassword_1 = __importDefault(require("../../validators/isPassword"));
const passwordSchema = new mongoose_1.default.Schema({
    user_id: {
        trim: true,
        type: String,
        unique: true,
        required: [true, "user_id is required!"],
    },
    password: {
        trim: true,
        type: String,
        validate: {
            validator: isPassword_1.default,
            message: (props) => `${props.value} is not a valid password!`,
        },
    },
}, { timestamps: true, validateBeforeSave: true });
// Create the Password model
const Password = mongoose_1.default.model("Password", passwordSchema);
exports.default = Password;
