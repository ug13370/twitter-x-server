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
exports.handleLogin = void 0;
const user_1 = __importDefault(require("../../models/User/user"));
const password_1 = __importDefault(require("../../models/User/password"));
const handleLogin = (loginDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetching user with this particular email address.
        const fetchedUser = yield user_1.default.findOne({ email_id: loginDetails.email_id });
        if (fetchedUser === null) {
            console.error("Wrong email id");
            return {
                status: "error",
                message: "No user exists with this email address",
                details: `${loginDetails.email_id} is not registered in DB.`,
            };
        }
        else {
            const fetchedPassword = yield password_1.default.findOne({
                user_id: fetchedUser.user_id,
            });
            if (fetchedPassword.password !== loginDetails.password) {
                console.error("Wrong password");
                return {
                    status: "error",
                    message: "Wrong password",
                    details: "Wrong Password",
                };
            }
            else {
                return {
                    status: "success",
                    message: "Login successfull",
                    details: { user_id: fetchedUser.user_id },
                };
            }
        }
    }
    catch (err) {
        console.error("User login check failed");
        return { status: "error", message: err._message, details: err.message };
    }
});
exports.handleLogin = handleLogin;
