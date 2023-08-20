// Express Import
const express = require("express");

// Model Imports
const User = require("../models/user");

const router = new express.Router();

router.get("/user", async (req, res) => {
  try {
    let users = await User.find({});
    console.log(users);
    res.status(201).send(users);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e);
  }
});

router.post("/user", async (req, res) => {
  const user = new User(req.body);

  try {
    await User.create(user);
    console.log(user);
    res.status(201).send(user);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e);
  }
});

router.delete("/user", async (req, res) => {
  try {
    let deleteRes = await User.deleteMany({});
    res.status(201).send(deleteRes);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e);
  }
});

module.exports = router;
