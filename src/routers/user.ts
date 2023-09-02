// Express Import
import express from "express";
import { Request, Response } from "express";

// Model Imports
import User from "../models/user";
import Password from "../models/password";
import { createNewUser } from "../middlewares/user_route";

const router = express.Router();

router.get("/user", async (req: any, res: any) => {
  try {
    let users = await User.find({});
    console.log(users);
    res.status(201).send(users);
  } catch (e: any) {
    console.log(e.message);
    res.status(400).send(e);
  }
});

router.post("/user", createNewUser, async (req: Request, res: Response) => {
  try {
    // Destructure request body.
    const { name, email_id, password } = req.body;

    // Saving user/password details
    let userCreationRes = await handleCreateNewUser({ name, email_id });
    let passwordCreationRes: any;
    if (userCreationRes.status === "success")
      passwordCreationRes = await handleRegisterNewPassword({
        user_id: userCreationRes.details.user_id,
        password,
      });

    // Conditional response firing
    if (userCreationRes.status === "error")
      res.status(422).json(userCreationRes);
    else if (passwordCreationRes.status === "error")
      res.status(422).json(passwordCreationRes);
    else res.status(201).json(userCreationRes);
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.details,
    });
  }
});

router.delete("/user", async (req: any, res: any) => {
  try {
    let deleteRes = await User.deleteMany({});
    res.status(201).send(deleteRes);
  } catch (e: any) {
    console.log(e.message);
    res.status(400).send(e);
  }
});

/** Helper Functions */
const handleCreateNewUser = async (userDetails: {
  name: string;
  email_id: string;
}) => {
  try {
    // Create a new user instance.
    const userInstance = new User(userDetails);

    // Save it in database.
    let savedRes: any = await userInstance.save();
    let { name, email_id, user_id } = savedRes._doc;

    // Returning user details.
    console.info("User creation successfull");
    return {
      status: "success",
      message: "User created successfully",
      details: { name, email_id, user_id },
    };
  } catch (err: any) {
    console.info("User creation failed");
    return { status: "error", message: err._message, details: err.message };
  }
};

const handleRegisterNewPassword = async (passwordDetails: {
  user_id: string;
  password: string;
}) => {
  try {
    // Create a new password instance.
    const passwordInstance = new Password(passwordDetails);

    // Save it in database.
    let savedRes: any = await passwordInstance.save();
    let { user_id, password } = savedRes._doc;

    // Returning password details.
    console.info("Password registration successfull");
    return {
      status: "success",
      message: "Password registered successfully",
      details: { user_id, password },
    };
  } catch (err: any) {
    console.error("Password registration failed");
    return { status: "error", message: err._message, details: err.message };
  }
};

module.exports = router;
