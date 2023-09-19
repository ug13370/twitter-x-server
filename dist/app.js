"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize Database connection
require("./db/mongoose");
// Initialize Routers
const session = require("express-session");
const authRouter = require("./routers/auth/router");
const userRouter = require("./routers/user/router");
const tweetRouter = require("./routers/tweet/router");
// Express Import
const express = require("express");
const app = express();
// Middleware for parsing incoming request in JSON
app.use(session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));
app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(tweetRouter);
exports.default = app;
