var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { handleLogin } from "./helpers";
import { login } from "../../middlewares/user_route";
const router = express.Router();
router.post("/login", login, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure request body.
        const { email_id, password } = req.body;
        // Validating email id and password.
        const loginResult = yield handleLogin({ email_id, password });
        // Sending response according to the login result.
        if (loginResult.status === "success") {
            req.session.user_id = loginResult.details.user_id;
            res.status(201).json(loginResult);
        }
        else
            res.status(422).json(loginResult);
    }
    catch (err) {
        // Handle any errors that may occur during the login process
        console.error("User login failed:", err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            details: err.message,
        });
    }
}));
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "Logout failed",
                details: "Could not clear session.",
            });
        }
        else {
            res.status(200).json({
                status: "success",
                message: "Logged out successfully",
                details: "Session cleared",
            });
        }
    });
});
export default router;
//# sourceMappingURL=router.js.map