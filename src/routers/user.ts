// Express Import
import express from "express";

// Model Imports
import User from "../models/user";
import Password from "../models/password";

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

router.post("/user", async (req: any, res: any) => {
  try {
    // Destructure request body.
    let { name, email_id, password } = req.body;

    // Fetch user and password details.
    let userDetails = { name, email_id };
    let passwordDetails = { password };

    // Create a new UserInstance
    const userInstance = new User(userDetails);
    const passwordInstance = new Password(passwordDetails);
    console.log(userInstance);
    console.log(passwordInstance);

    try {
      // Save User/Password in database.
      await User.create(userInstance);
      await Password.create(passwordInstance);

      res.status(201).send(userInstance);
    } catch (e: any) {
      console.log(e.message);
      res.status(400).send(e);
    }
  } catch (e: any) {
    console.log(e.message);
    res
      .status(400)
      .send({ status: "error", message: "Body Parameter is missing" });
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

module.exports = router;
