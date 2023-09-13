import express from "express";
import { Request, Response } from "express";
import { handleCreateNewTweet, handleRegisterTweetMedias } from "./helpers";
import { createNewTweet } from "../../middlewares/tweet_route";

const router = express.Router();

// Create a tweet (post/comment)
router.post("/tweet", createNewTweet, async (req: Request, res: Response) => {
  try {
    // Destructure request body.
    const { user_id, text_content, type, medias = [] } = req.body;

    // Create a new user with user details
    const tweetCreationRes = await handleCreateNewTweet({
      user_id,
      text_content,
      type,
    });

    // Check if tweet creation was successfull
    if (tweetCreationRes.status === "success") {
      // Register medias
      const mediasRegistrationRes = await handleRegisterTweetMedias({
        tweet_id: tweetCreationRes.details.tweet_id,
        user_id,
        medias,
      });

      // Check if media registration was successful
      if (mediasRegistrationRes.status === "success") {
        // User and password creation successful
        res.status(201).json({
          user_id: tweetCreationRes.details.user_id,
          tweet_id: tweetCreationRes.details.tweet_id,
          medias: mediasRegistrationRes.details.medias,
          created_at: tweetCreationRes.details.created_at,
          text_content: tweetCreationRes.details.text_content,
        });
      } else {
        // Media registrationn failed
        res.status(422).json(mediasRegistrationRes);
      }
    } else {
      // User creation failed
      res.status(422).json(tweetCreationRes);
    }
  } catch (err: any) {
    console.error("Tweet creation failed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

// Edit a tweet
// Like/Dislike a tweet
// Fetch timeline setwise.
// Fetch all posts for a particular user setwise.
// Fetch all replies for a particular user setwise.
// Fetch all medias.
// Fetch all like medias.
// Delete a tweet
// Delete all tweets for a specific user

module.exports = router;
