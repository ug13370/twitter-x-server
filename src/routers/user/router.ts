// Express Import
import express from "express";
import { Request, Response } from "express";

// Model Imports
import {
  handleUserToFollow,
  handleCreateNewUser,
  handleUserToUnfollow,
  handleRegisterNewPassword,
} from "./helpers";
import User from "../../models/User/user";
import {
  createNewUser,
  updateSingleUser,
  deleteSingleUser,
  updateUserPassword,
  followOrUnfollowUser,
} from "../../middlewares/user_route";
import Password from "../../models/User/password";
import { userAuthCheck } from "../../middlewares/auth";
import UserUserRelationship from "../../models/User/user-user-relationship";

const router = express.Router();

// Define a route to fetch all users
router.get("/user", [userAuthCheck], async (req: any, res: Response) => {
  try {
    // Fetch Session details
    const session_user_id = req.session.user_id;

    // Fetch all users from the database
    const users = await User.find({});

    // Check if users were found
    if (users.length > 0) {
      // Users fetched successfully
      console.log("Users fetched successfully.");

      let details = [];
      for (let i = 0; i < users.length; i++) {
        let obj = {
          user_id: users[i].user_id,
          name: users[i].name,
          following: false,
        };
        obj["following"] = (await UserUserRelationship.findOne({
          follower_user_id: session_user_id,
          followee_user_id: users[i].user_id,
        }))
          ? true
          : false;
        details.push(obj);
      }

      res.status(200).send({
        status: "success",
        message: "Users fetched successfully.",
        details: details.filter(
          (user: any) => user.user_id !== session_user_id
        ),
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
    const { user_id, name, email_id, dob, password } = req.body;

    // Create a new user with user details
    const userCreationRes = await handleCreateNewUser({
      user_id,
      name,
      email_id,
      dob,
    });

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

// Define a route to update user details
router.patch("/user", updateSingleUser, async (req: Request, res: Response) => {
  try {
    // Destructure and validate request body.
    const { user_id, name, dob, bio, location } = req.body;

    // Fields to modify
    const fields: Record<string, any> = {};

    if (name !== undefined) fields.name = name;
    if (dob !== undefined) fields.dob = dob;
    if (bio !== undefined) fields.bio = bio;
    if (location !== undefined) fields.location = location;

    // Update user details using User.updateOne()
    const result: any = await User.findOneAndUpdate(
      { user_id: user_id },
      fields,
      {
        runValidators: true,
        new: true,
      }
    );

    // Check if any documents were modified
    if (!result) {
      // If no documents were modified, the user with the specified ID was not found.
      console.log("No users were found in the database to update!");
      return res.status(404).json({
        status: "error",
        message: "No user found",
        details: "No users were found in the database.",
      });
    } else {
      // User details updated successfully
      console.log("User details updated successfully!");
      res.status(200).json({
        status: "success",
        message: "User details updated successfully",
        details: result,
      });
    }
  } catch (err: any) {
    // Handle other errors
    console.error("User details updation failed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

// Define a route to update user password
router.patch(
  "/user/password",
  updateUserPassword,
  async (req: Request, res: Response) => {
    try {
      // Destructure and validate request body.
      const { user_id, new_password } = req.body;

      // Fields to modify
      const fields: Record<string, any> = { password: new_password };

      // Update user's password details using Password.updateOne()
      const result: any = await Password.findOneAndUpdate(
        { user_id: user_id },
        fields,
        {
          runValidators: true,
          new: true,
        }
      );

      // Check if any documents were modified
      if (!result) {
        // If no documents were modified, the user with the specified ID was not found.
        console.log("No users were found in the database to update!");
        return res.status(404).json({
          status: "error",
          message: "No user found",
          details: "No users were found in the database.",
        });
      } else {
        // User details updated successfully
        console.log("User's password updated successfully!");
        res.status(200).json({
          status: "success",
          message: "User's password updated successfully",
          details: result,
        });
      }
    } catch (err: any) {
      // Handle other errors
      console.error("User's password updation failed:", err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);

// Define a route to follow a user.
router.post(
  "/user/follow",
  followOrUnfollowUser,
  async (req: any, res: Response) => {
    try {
      // Fetch Session details
      const follower_user_id = req.session.user_id;

      // Destructure request body.
      const { followee_user_id } = req.body;

      // Create a new user relationship with relationship details
      const userRelationshipCreationRes = await handleUserToFollow({
        follower_user_id,
        followee_user_id,
      });

      // Check if user relationship creation was successful
      if (userRelationshipCreationRes.status === "success") {
        // User relationship creation passed.
        res.status(201).json(userRelationshipCreationRes);
      } else {
        // User relationship creation failed
        res.status(422).json(userRelationshipCreationRes);
      }
    } catch (err: any) {
      // Handle any errors that may occur during the creation process
      console.error("User following failed:", err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);

// Define a route to unfollow a user.
router.delete(
  "/user/unfollow",
  followOrUnfollowUser,
  async (req: any, res: Response) => {
    try {
      // Fetch Session details
      const follower_user_id = req.session.user_id;

      // Destructure request body.
      const { followee_user_id } = req.body;

      // Delete a user relationship with relationship details
      const userRelationshipDeletionRes = await handleUserToUnfollow({
        follower_user_id,
        followee_user_id,
      });

      // Check if user relationship deletion was successful
      if (userRelationshipDeletionRes.status === "success") {
        // User relationship deletion passed.
        res.status(201).json(userRelationshipDeletionRes);
      } else {
        // User relationship deletion failed
        res.status(422).json(userRelationshipDeletionRes);
      }
    } catch (err: any) {
      // Handle any errors that may occur during the deletion process
      console.error("User unfollowing failed:", err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);

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

export default router;
