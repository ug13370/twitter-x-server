// Express Import
import express from "express";
import { Request, Response } from "express";

// Model Imports
import User from "../models/user";
import Password from "../models/password";
import { createNewUser, deleteSingleUser } from "../middlewares/user_route";

const router = express.Router();

// Define a route to fetch all users
router.get("/user", async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Check if users were found
    if (users.length > 0) {
      // Users fetched successfully
      console.log("Users fetched successfully.");
      res.status(200).send({
        status: "success",
        message: "Users fetched successfully.",
        details: users,
      });
    } else {
      // No users found
      console.log("No users found.");
      res.status(404).send({
        status: "error",
        message: "No users found.",
        details: "No users were found in the database.",
      });
    }
  } catch (err: any) {
    // Handle any errors that may occur during the fetch
    console.error("Users fetching failed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

// Define a route to create a new user
router.post("/user", createNewUser, async (req: Request, res: Response) => {
  try {
    // Destructure request body.
    const { name, email_id, dob, password } = req.body;

    // Create a new user with user details
    const userCreationRes = await handleCreateNewUser({ name, email_id, dob });

    // Check if user creation was successful
    if (userCreationRes.status === "success") {
      // Create a new password with user_id and password
      const passwordCreationRes = await handleRegisterNewPassword({
        user_id: userCreationRes.details.user_id,
        password,
      });

      // Check if password creation was successful
      if (passwordCreationRes.status === "success") {
        // User and password creation successful
        res.status(201).json(userCreationRes);
      } else {
        // Password creation failed
        res.status(422).json(passwordCreationRes);
      }
    } else {
      // User creation failed
      res.status(422).json(userCreationRes);
    }
  } catch (err: any) {
    // Handle any errors that may occur during the creation process
    console.error("User creation failed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

// Update user details.

// Update user password

// Define a route to delete a user by their user_id
router.delete(
  "/user/:user_id",
  deleteSingleUser,
  async (req: Request, res: Response) => {
    try {
      // Attempt to delete the user based on their user_id
      const deleteRes = await User.deleteOne({ user_id: req.params.user_id });

      // Check if the user was successfully deleted
      if (deleteRes.deletedCount === 1) {
        // User deleted successfully
        console.log("User deleted successfully.");
        res.status(201).send({
          status: "success",
          message: "User deleted successfully.",
          details: deleteRes,
        });
      } else {
        // User not found with the provided user_id
        console.log("User not found.");
        res.status(404).send({
          status: "error",
          message: "User not found.",
          details: "No user found with the provided user_id.",
        });
      }
    } catch (err: any) {
      // Handle any errors that occurred during the deletion
      console.error("User deletion failed:", err);
      res.status(500).send({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);

// Define a route to delete all users
router.delete("/user", async (req: Request, res: Response) => {
  try {
    // Attempt to delete all users
    const deleteRes = await User.deleteMany({});

    // Check if users were successfully deleted
    if (deleteRes.deletedCount > 0) {
      // Users deleted successfully
      console.log("Users deleted successfully.");
      res.status(201).send({
        status: "success",
        message: "Users deleted successfully.",
        details: deleteRes,
      });
    } else {
      // No users found to delete
      console.log("No users found to delete.");
      res.status(404).send({
        status: "error",
        message: "No users found to delete.",
        details: "No users were found to delete.",
      });
    }
  } catch (err: any) {
    // Handle any errors that occurred during the deletion
    console.error("Users deletion failed:", err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

/** Helper Functions */
const handleCreateNewUser = async (userDetails: {
  name: String;
  email_id: String;
  dob: Date;
}) => {
  try {
    // Create a new user instance.
    const userInstance = new User(userDetails);

    // Save it in database.
    let savedRes: any = await userInstance.save();
    let { name, email_id, user_id, dob } = savedRes._doc;

    // Returning user details.
    console.info("User creation successfull");
    return {
      status: "success",
      message: "User created successfully",
      details: { name, email_id, user_id, dob },
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
