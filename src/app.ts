// Initialize Database connection
require("./db/mongoose");

// Initialize Routers
const userRouter = require("./routers/user/router");
const tweetRouter = require("./routers/tweet/router");

// Express Import
const express = require("express");

const app = express();

// Middleware for parsing incoming request in JSON
app.use(express.json());
app.use(userRouter);
app.use(tweetRouter);

export default app;
