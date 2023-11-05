import express from "express";
import { Request, Response } from "express";
import { clearCookie, handleLogin } from "./helpers";
import { login } from "../../middlewares/user_route";

const router = express.Router();

router.post("/login", login, async (req: any, res: Response) => {
  try {
    // Destructure request body.
    const { email_id, password } = req.body;

    // Validating email id and password.
    const loginResult = await handleLogin({ email_id, password });

    // Sending response according to the login result.
    if (loginResult.status === "success") {
      // Save user id/user name in session.
      req.session.user_id = loginResult.details.user_id;
      req.session.user_name = loginResult.details.name;

      // Sending back the login result.
      res.status(201).json(loginResult);
    } else res.status(422).json(loginResult);
  } catch (err: any) {
    // Handle any errors that may occur during the login process
    console.error("User login failed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

router.post("/logout", (req: any, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Logout failed",
        details: "Could not clear session.",
      });
    } else {
      clearCookie(res, "session_id");
      res.status(205).json({
        status: "success",
        message: "Logged out successfully",
        details: "Session cleared",
      });
    }
  });
});

export default router;
