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
import cors from "cors";

// Connect Mongo Import
import MongoStore from "connect-mongo";

// Body parser Import
import bodyParser from "body-parser";

const app = express();

const sessionStore = MongoStore.create({
  collectionName: "sessions",
  mongoUrl: process.env.MONGODB_URL || "",
});

// Use the bodyParser middleware with an increased limit
app.use(bodyParser.json({ limit: "15mb" })); // Change the limit value as needed
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" })); // Change the limit value as needed

app.set("trust proxy", 1);

app.use(
  cors({
    // origin: "https://twitter-frontend-utkarsh-gupta.netlify.app", // Use this in production
    origin: "http://localhost:3000", // Use this for local
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  session({
    name: "session_id",
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
      httpOnly: true, // Recommended for security
      // sameSite: "none", // Use this for production
      // secure: true, // Use this for production
    },
  })
);

app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(tweetRouter);

export default app;

// https://medium.com/@anandam00/understanding-session-based-authentication-in-nodejs-bc2a7b9e5a0b#:~:text=Session%2Dbased%20authentication%20is%20a%20popular%20method%20for%20implementing%20user,protect%20application%20routes%20and%20resources.
// https://stackoverflow.com/questions/64627649/express-session-is-not-setting-cookies-in-browser
// https://github.com/expressjs/cookie-session/issues/71
