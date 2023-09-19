import express from "express";
import { handleLogin } from "./helpers";
import { Request, Response } from "express";
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
      req.session.user_id = loginResult.details.user_id;
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
      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
        details: "Session cleared",
      });
    }
  });
});

export default router;
