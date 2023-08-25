// Initialize Database connection
require("./db/mongoose");

// Initialize Routers
const userRouter = require("./routers/user");

// Express Import
const express = require("express");

const app = express();

// Middleware for parsing incoming request in JSON
app.use(express.json());
app.use(userRouter);

export default app;
