// Initialize Database connection
import "./db/mongoose.js";

// Initialize Routers
import session from "express-session";
import authRouter from "./routers/auth/router.js";
import userRouter from "./routers/user/router.js";
import tweetRouter from "./routers/tweet/router.js";

// Express Import
import express from "express";

// Cors Import
import cors from 'cors';

const app = express();

// Middleware for parsing incoming request in JSON
app.use(cors({
  origin: '*', // or '*' to allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'], // Include 'Content-Type' in the allowed headers
  credentials: true, // If you are using cookies or sessions, set this to true
}));

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(tweetRouter);

export default app;
